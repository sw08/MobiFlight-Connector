using SharpDX.DirectInput;
using System;

namespace MobiFlight.Joysticks
{
    internal class AuthentikitReport
    {
        private byte[] LastInputBufferState = new byte[5];

        public void CopyFromInputBuffer(byte[] inputBuffer)
        {
            if (inputBuffer == null || inputBuffer.Length < LastInputBufferState.Length)
            {
                throw new ArgumentException($"Invalid input buffer length. Expected {LastInputBufferState.Length}, got {inputBuffer?.Length ?? 0}");
            }
            LastInputBufferState = (byte[])inputBuffer?.Clone();
        }

        public AuthentikitReport Parse(byte[] inputBuffer)
        {
            var result = new AuthentikitReport();
            result.CopyFromInputBuffer(inputBuffer);

            return result;
        }

        public JoystickState ToJoystickState()
        {
            // Device       Name                         Note                                    Mask    Byte[]  Bit[]   Example
            // -            Head                         Constant: 0xF2                          -       0       -       0xF2
            // -            Head                         Constant: 0xE1                          -       1       -       0xE1
            // -            Head                         Constant: 0x03                          -       2       -       0x03
            // -            Data Type Total              Has 2 Data Type                         -       3       -       0x02
            // -            Data Type                    Bit Type                                -       4       -       0x01
            // -            Data Length                  Following data occupies 2 Bytes         -       5       -       0x02
            // Button       SPD MACH Switch              Press:1, Release: 0                     0x01    6       0       1
            // Button       SPD Knob Push                Push: 1, Release: 0                     0x02    6       1       1
            // Button       SPD Knob Pull                Pull: 1, Release: 0                     0x04    6       2       1
            // Button       HDG TRK Switch               Press: 1, Release: 0                    0x08    6       3       1
            // Button       HDG Knob Push                Push: 1, Release: 0                     0x10    6       4       1
            // Button       HDG Knob Pull                Pull: 1, Release: 0                     0x20    6       5       1
            // Button       ALT 100                      Pointing: 1, Non-pointing: 0            0x40    6       6       1
            // Button       ALT 1000                     Pointing: 1, Non-pointing: 0            0x80    6       7       1
            // Button       ALT Knob Push                Push: 1, Release: 0                     0x01    7       0       1
            // Button       ALT Knob Pull                Pull: 1, Release: 0                     0x02    7       1       1
            // Button       VS Knob Push                 Push: 1, Release: 0                     0x04    7       2       1
            // Button       VS Knob Pull                 Pull: 1, Release: 0                     0x08    7       3       1
            // Button       METRIC ALT                   Press: 1, Release: 0                    0x10    7       4       1
            // Button       AP1                          Press: 1, Release: 0                    0x20    7       5       1
            // Button       AP2                          Press: 1, Release: 0                    0x40    7       6       1
            // Button       A/THR                        Press: 1, Release: 0                    0x80    7       7       1
            // Button       LOC                          Press: 1, Release: 0                    0x01    8       0       1
            // Button       EXPED                        Press: 1, Release: 0                    0x02    8       1       1
            // Button       APPR                         Press: 1, Release: 0                    0x04    8       2       1
            // -            (Reserve)                    -                                       -       8       3       0
            // -            (Reserve)                    -                                       -       8       4       0
            // -            (Reserve)                    -                                       -       8       5       0
            // -            (Reserve)                    -                                       -       8       6       0
            // -            (Reserve)                    -                                       -       8       7       0
            // -            Data Type                    Single Byte Type                        -       9       -       0x02
            // -            Data Length                  Following data occupies 6 Bytes         -       10      -       0x06
            // Encoder      SPD Knob Rotate              0x00~0xFF in Two's Complement           -       11      -       0
            // Encoder      HDG Knob Rotate              0x00~0xFF in Two's Complement           -       12      -       0
            // Encoder      ALT Knob Rotate              0x00~0xFF in Two's Complement           -       13      -       0
            // Encoder      VS Knob Rotate               0x00~0xFF in Two's Complement           -       14      -       0
            // Axis         Background Light Brightness  0x00(Minimum)~0xFF(Maximum)             -       15      -       0xFF
            // Axis         LCD Light Brightness         0x00(Minimum)~0xFF(Maximum)             -       16      -       0xFF

            JoystickState state = new JoystickState();

            // Buttons
            // copy the button states from the buffer to the Buttons bit by bit starting from byte 6 to byte 8
            for (int i = 0; i < 19; i++)
            {
                int byteIndex = (i / 8);
                int bitIndex = i % 8;
                bool isPressed = (LastInputBufferState[byteIndex] & (1 << bitIndex)) != 0;
                state.Buttons[i] = isPressed;
            }

            return state;
        }
    }
}
