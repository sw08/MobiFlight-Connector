using HidSharp;
using HidSharp.Reports;
using HidSharp.Reports.Input;
using SharpDX.DirectInput;
using System;
using System.Linq;

namespace MobiFlight.Joysticks
{
    internal class Authentikit : Joystick
    {
        /// <summary>
        /// The specific HID device instance.
        /// Using HidSharp for HID communication.
        /// </summary>
        private HidDevice Device { get; set; }

        /// <summary>
        /// The HID stream for reading reports.
        /// </summary>
        private HidStream Stream { get; set; }

        /// <summary>
        /// HidSharp input receiver for event-driven report reading.
        /// </summary>
        protected HidDeviceInputReceiver inputReceiver;

        /// <summary>
        /// HID report descriptor for parsing device capabilities.
        /// </summary>
        protected ReportDescriptor reportDescriptor;

        /// <summary>
        /// The report implementation.
        /// </summary>
        private readonly AuthentikitReport report = new AuthentikitReport();

        /// <summary>
        /// Provide same instance name as defined in the definition file.
        /// Also works if Definition file is not set yet.
        /// </summary>
        public override string Name
        {
            get { return Definition?.InstanceName ?? "Authentikit"; }
        }

        /// <summary>
        /// Provides Serial including prefix.
        /// Serial information is provided through HidSharp
        /// </summary>
        public override string Serial
        {
            get { return $"{Joystick.SerialPrefix}{Device?.GetSerialNumber() ?? "Authentikit"}"; }
        }

        /// <summary>
        /// The constructor.
        /// </summary>
        /// <param name="definition">joystick definition file.</param>
        public Authentikit(SharpDX.DirectInput.Joystick joystick, JoystickDefinition definition) : base(joystick, definition)
        {
        }

        /// <summary>
        /// This creates a connection to the HID device using HidSharp.
        /// </summary>
        protected void Connect()
        {
            // Prevent reentry and parallel execution by multiple threads
            lock (this)
            {
                var VendorId = Definition.VendorId;
                var ProductId = Definition.ProductId;

                if (Device == null)
                {
                    Device = DeviceList.Local.GetHidDeviceOrNull(vendorID: VendorId, productID: ProductId);
                    if (Device == null)
                    {
                        Log.Instance.log($"no AuthentiKit found with VID:{VendorId.ToString("X4")} and PID:{ProductId.ToString("X4")}", LogSeverity.Info);
                        return;
                    }
                }

                if (Stream == null)
                {
                    try
                    {
                        Stream = Device.Open();
                        Stream.ReadTimeout = System.Threading.Timeout.Infinite;
                        reportDescriptor = Device.GetReportDescriptor();

                        Log.Instance.log($"Found AuthentiKit device: VID:{Device.VendorID:X4} PID:{Device.ProductID:X4}", LogSeverity.Info);
                    }
                    catch (Exception ex)
                    {
                        Log.Instance.log($"Failed to open AuthentiKit device: {ex.Message}", LogSeverity.Error);
                        return;
                    }

                    LogAvailableAxes();
                }

                if (inputReceiver == null)
                {
                    inputReceiver = reportDescriptor.CreateHidDeviceInputReceiver();
                    inputReceiver.Received += InputReceiver_Received;
                    inputReceiver.Start(Stream);
                }
            }
        }

        /// <summary>
        /// Logs available axes from the HID report descriptor.
        /// </summary>
        private void LogAvailableAxes()
        {
            var inputReports = reportDescriptor.InputReports;
            foreach (var inputReport in inputReports)
            {
                foreach (var dataItem in inputReport.DataItems)
                {
                    if (dataItem.IsArray == false && dataItem.Usages.Count > 0)
                    {
                        var usage = dataItem.Usages.GetValuesFromIndex(0).First();
                        // Extract just the Usage ID (lower 16 bits)
                        var usageId = (int)(usage & 0xFFFF);

                        // ignore the pointer information
                        if (usageId == 1) continue;

                        try
                        {
                            var axisName = GetAxisNameForUsage(usageId);
                            if (!string.IsNullOrEmpty(axisName))
                            {
                                Log.Instance.log($"  Available axis: {axisName} (Usage: 0x{usage:X2})", LogSeverity.Debug);
                            }
                        }
                        catch (ArgumentOutOfRangeException)
                        {
                            Log.Instance.log($"  Unknown axis (Usage: 0x{usage:X}, ID: {usageId})", LogSeverity.Error);
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Event handler for received HID reports.
        /// </summary>
        private void InputReceiver_Received(object sender, EventArgs e)
        {
            var inputReceiver = sender as HidDeviceInputReceiver;
            byte[] inputReportBuffer = new byte[Device.GetMaxInputReportLength()];

            while (inputReceiver.TryRead(inputReportBuffer, 0, out _))
            {
                // First byte is report ID, remaining bytes are the data
                byte reportId = inputReportBuffer[0];
                byte[] data = new byte[inputReportBuffer.Length - 1];
                Array.Copy(inputReportBuffer, 1, data, 0, data.Length);

                ProcessInputReportBuffer(reportId, data);
            }
        }

        /// <summary>
        /// Update is called by the base class.
        /// It ensures that the HID device is correctly initialized.
        /// </summary>
        public override void Update()
        {
            if (Stream == null || inputReceiver == null)
            {
                Connect();
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
            if (Stream != null)
            {
                Stream.Close();
                Stream = null;
            }

            if (inputReceiver != null)
            {
                inputReceiver.Received -= InputReceiver_Received;
                inputReceiver = null;
            }

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