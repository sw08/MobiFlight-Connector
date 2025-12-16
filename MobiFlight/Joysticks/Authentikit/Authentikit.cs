using Device.Net;
using Hid.Net;
using Hid.Net.Windows;
using SharpDX.DirectInput;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MobiFlight.Joysticks
{
    internal class AuthentiKit : Joystick
    {
        /// <summary>
        /// Used for reading HID reports in a background thread.
        /// </summary>
        bool DoReadHidReports = false;

        /// <summary>
        /// The thread that reads HID reports.
        /// </summary>
        private Thread readThread;

        /// <summary>
        /// The specific HID device instance.
        /// This is using the Device.Net library for HID communication.
        /// It provides improved performance compared to HidSharp
        /// </summary>
        IHidDevice Device { get; set; }

        /// <summary>
        /// The report implementation.
        /// </summary>
        private readonly AuthentiKitReport report = new AuthentiKitReport();

        /// <summary>
        /// Provide same instance name as defined in the definition file.
        /// Also works if Definition file is not set yet.
        /// </summary>
        public override string Name
        {
            get { return Definition?.InstanceName.Trim() ?? "AuthentiKit"; }
        }

        /// <summary>
        /// Provides Serial including prefix.
        /// Serial information is provided through HidSharp
        /// </summary>
        public override string Serial
        {
            get { return $"{Joystick.SerialPrefix}{DIJoystick.Information.InstanceGuid}"; }
        }

        /// <summary>
        /// The constructor.
        /// </summary>
        /// <param name="definition">joystick definition file.</param>
        public AuthentiKit(SharpDX.DirectInput.Joystick joystick, JoystickDefinition definition) : base(joystick, definition)
        {
        }

        /// <summary>
        /// This creates a connection to the HID device using HidSharp.
        /// </summary>
        protected async Task<bool> Connect()
        {
            var VendorId = Definition.VendorId;
            var ProductId = Definition.ProductId;

            var hidFactory = new FilterDeviceDefinition(vendorId: (uint)VendorId, productId: (uint)ProductId).CreateWindowsHidDeviceFactory(writeBufferSize: 1);
            var deviceDefinitions = (await hidFactory.GetConnectedDeviceDefinitionsAsync().ConfigureAwait(false)).ToList();

            if (deviceDefinitions.Count == 0)
            {
                Log.Instance.log($"no AuthentiKit found with VID:{VendorId.ToString("X4")} and PID:{ProductId.ToString("X4")}", LogSeverity.Info);
                return false;
            }

            Device = (IHidDevice)await hidFactory.GetDeviceAsync(deviceDefinitions.First()).ConfigureAwait(false);

            try
            {
                await Device.InitializeAsync().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                Log.Instance.log($"Failed to open AuthentiKit device: {ex.Message}", LogSeverity.Error);
                return false;
            }

            DoReadHidReports = true;

            readThread = new Thread(ReadHidReportsLoop)
            {
                IsBackground = true,
                Name = "Authentikit-HID-Reader"
            };
            readThread.Start();

            return true;
        }

        /// <summary>
        /// Method called by read thread
        /// </summary>
        private void ReadHidReportsLoop()
        {
            while (DoReadHidReports)
            {
                try
                {
                    var HidReport = Device.ReadReportAsync().ConfigureAwait(false).GetAwaiter().GetResult();
                    var data = HidReport.TransferResult.Data;
                    ProcessInputReportBuffer(HidReport.ReportId, data);
                }
                catch
                {
                    // Exception when disconnecting while mobiflight is running.
                    Shutdown();
                    break;
                }
            }
        }

        /// <summary>
        /// Update is called by the base class.
        /// It ensures that the HID device is correctly initialized.
        /// </summary>
        public override void Update()
        {
            if (Device == null || !Device.IsInitialized)
            {
                var connected = Connect().GetAwaiter().GetResult();
                if (!connected) return;
            }
        }

        /// <summary>
        /// This processes the input report buffer, triggers button events and stores the state.
        /// </summary>
        /// <param name="reportId">The HID report ID</param>
        /// <param name="inputReportBuffer">The report data buffer</param>
        protected void ProcessInputReportBuffer(byte reportId, byte[] inputReportBuffer)
        {
            var newState = report.Parse(inputReportBuffer).ToJoystickState(Axes);
            UpdateButtons(newState);
            UpdateAxis(newState);
            // Finally store the new state as last state
            State = newState;
        }

        /// <summary>
        /// Enumerates and categorizes joystick devices based on their type.
        /// </summary>
        /// <remarks>This method processes the joystick device definitions and categorizes them into 
        /// analog inputs, buttons, or POV controls. Devices are added to their respective collections based on their
        /// type.</remarks>
        protected override void EnumerateDevices()
        {
            base.EnumerateDevices();
        }

        /// <summary>
        /// Cleans up any specific resources.
        /// </summary>
        public override void Shutdown()
        {
            DoReadHidReports = false;
            readThread?.Join(1000);
            Device?.Dispose();

            base.Shutdown();
        }

        protected override void UpdateAxis(JoystickState newState)
        {
            for (int CurrentAxis = 0; CurrentAxis != Axes.Count; CurrentAxis++)
            {

                int oldValue = 0;
                if (StateExists())
                {
                    oldValue = GetValueForAxisFromState(CurrentAxis, State);
                }

                int newValue = GetValueForAxisFromState(CurrentAxis, newState);

                if (StateExists() && Math.Abs(oldValue - newValue) < 2 << 4) continue;

                TriggerButtonPressed(this, new InputEventArgs()
                {
                    Name = Name,
                    DeviceId = Axes[CurrentAxis].Name,
                    DeviceLabel = Axes[CurrentAxis].Label,
                    Serial = Serial,
                    Type = DeviceType.AnalogInput,
                    Value = newValue
                });
            }
        }
    }
}