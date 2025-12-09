using Device.Net;
using Hid.Net;
using Hid.Net.Windows;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MobiFlight.Joysticks
{
    internal class Authentikit : Joystick
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
        /// The report implementation for the FCU Cube.
        /// </summary>
        private readonly AuthentikitReport report = new AuthentikitReport();

        /// <summary>
        /// Provide same instance name as defined in the definition file.
        /// Also works if Defintion file is not set yet.
        /// </summary>
        public override string Name
        {
            get { return Definition?.InstanceName ?? "Authentikit"; }
        }

        /// <summary>
        /// Provides Serial including prefix.
        /// Serial information is provided through Device.Net
        /// </summary>
        public override string Serial
        {
            get { return $"{Joystick.SerialPrefix}{Device?.ConnectedDeviceDefinition?.SerialNumber}" ?? "Authentikit"; }
        }

        /// <summary>
        /// The constructor.
        /// </summary>
        /// <param name="definition">joystick definition file.</param>
        public Authentikit(JoystickDefinition definition) : base(null, definition)
        {
        }

        /// <summary>
        /// This creates a connection to the HID device using the Device.Net library.
        /// </summary>
        /// <returns></returns>
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

            var deviceDefinition = deviceDefinitions.First();
            
            Device = (IHidDevice)await hidFactory.GetDeviceAsync(deviceDefinitions.First()).ConfigureAwait(false);

            try {                 
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
                    // Exception when disconnecting fcu while mobiflight is running.
                    Shutdown();
                    break;
                }
            }
        }

        /// <summary>
        /// Update is called by the base class
        /// It is currently needed to ensure that the hid device is correctly initialized.
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
        /// This processes the input report buffer, triggers button events and stores the state
        /// 
        /// </summary>
        /// <remarks>
        /// This could be done in the base class.
        /// </remarks>
        /// <param name="reportId"></param>
        /// <param name="inputReportBuffer"></param>
        protected void ProcessInputReportBuffer(byte reportId, byte[] inputReportBuffer)
        {
            var newState = report.Parse(inputReportBuffer).ToJoystickState();
            UpdateButtons(newState);
            UpdateAxis(newState);
            // Finally store the new state as last state
            State = newState;
        }

        /// <summary>
        /// Enumerates and categorizes joystick devices based on their type.
        /// </summary>
        /// <remarks>This method processes the joystick device definitions and categorizes them into 
        /// analog inputs, buttons, or POV controls. Devices are added to their respective  collections based on their
        /// type.</remarks>
        protected override void EnumerateDevices()
        {
            Definition.Inputs.ForEach(d => {
                var device = new JoystickDevice() { Name = d.Name, Label = d.Label, JoystickDeviceType = d.Type };
                switch (d.Type)
                {
                    case JoystickDeviceType.Axis:
                        device.Type = DeviceType.AnalogInput;
                        Axes.Add(device);
                        break;
                    case JoystickDeviceType.Button:
                        device.Type = DeviceType.Button;
                        Buttons.Add(device);
                        break;
                    case JoystickDeviceType.POV:
                        device.Type = DeviceType.Button;
                        POV.Add(device);
                        break;
                }
            });
        }

        /// <summary>
        /// Cleans up any specific resources, e.g. thread and device connection.
        /// </summary>
        public override void Shutdown()
        {
            DoReadHidReports = false;
            readThread?.Join(1000);
            Device?.Dispose();

            base.Shutdown();
        }
    }
}
