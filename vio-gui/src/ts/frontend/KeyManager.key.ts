
enum Key {
    KeyA       = "KeyA",       // 0x001E
    KeyB       = "KeyB",       // 0x0030
    KeyC       = "KeyC",       // 0x002E
    KeyD       = "KeyD",       // 0x0020
    KeyE       = "KeyE",       // 0x0012
    KeyF       = "KeyF",       // 0x0021
    KeyG       = "KeyG",       // 0x0022
    KeyH       = "KeyH",       // 0x0023
    KeyI       = "KeyI",       // 0x0017
    KeyJ       = "KeyJ",       // 0x0024
    KeyK       = "KeyK",       // 0x0025
    KeyL       = "KeyL",       // 0x0026
    KeyM       = "KeyM",       // 0x0032
    KeyN       = "KeyN",       // 0x0031
    KeyO       = "KeyO",       // 0x0018
    KeyP       = "KeyP",       // 0x0019
    KeyQ       = "KeyQ",       // 0x0010
    KeyR       = "KeyR",       // 0x0013
    KeyS       = "KeyS",       // 0x001F
    KeyT       = "KeyT",       // 0x0014
    KeyU       = "KeyU",       // 0x0016
    KeyV       = "KeyV",       // 0x002F
    KeyW       = "KeyW",       // 0x0011
    KeyX       = "KeyX",       // 0x002D
    KeyY       = "KeyY",       // 0x0015
    KeyZ       = "KeyZ",       // 0x002C

    Digit0     = "Digit0",     // 0x0002
    Digit1     = "Digit1",     // 0x0003
    Digit2     = "Digit2",     // 0x0004
    Digit3     = "Digit3",     // 0x0005
    Digit4     = "Digit4",     // 0x0006
    Digit5     = "Digit5",     // 0x0007
    Digit6     = "Digit6",     // 0x0008
    Digit7     = "Digit7",     // 0x0009
    Digit8     = "Digit8",     // 0x000A
    Digit9     = "Digit9",     // 0x000B
    
    Numpad0    = "Numpad0",    // 0x0052
    Numpad1    = "Numpad1",    // 0x004F
    Numpad2    = "Numpad2",    // 0x0050
    Numpad3    = "Numpad3",    // 0x0051
    Numpad4    = "Numpad4",    // 0x004B
    Numpad5    = "Numpad5",    // 0x004C
    Numpad6    = "Numpad6",    // 0x004D
    Numpad7    = "Numpad7",    // 0x0047
    Numpad8    = "Numpad8",    // 0x0048
    Numpad9    = "Numpad9",    // 0x0049

    ArrowUp    = "ArrowUp",    // 0xE048
    ArrowLeft  = "ArrowLeft",  // 0xE04B
    ArrowRight = "ArrowRight", // 0xE04D
    ArrowDown  = "ArrowDown",  // 0xE050

    Space      = "Space",      // 0x0039

    Unknown    = "Unknown",    // 0xFFFF
}

namespace Key {
    export function mapKey(key: Key): string {
        switch (key) {
            case Key.KeyA:           return "A";
            case Key.KeyB:           return "B";
            case Key.KeyC:           return "C";
            case Key.KeyD:           return "D";
            case Key.KeyE:           return "E";
            case Key.KeyF:           return "F";
            case Key.KeyG:           return "G";
            case Key.KeyH:           return "H";
            case Key.KeyI:           return "I";
            case Key.KeyJ:           return "J";
            case Key.KeyK:           return "K";
            case Key.KeyL:           return "L";
            case Key.KeyM:           return "M";
            case Key.KeyN:           return "N";
            case Key.KeyO:           return "O";
            case Key.KeyP:           return "P";
            case Key.KeyQ:           return "Q";
            case Key.KeyR:           return "R";
            case Key.KeyS:           return "S";
            case Key.KeyT:           return "T";
            case Key.KeyU:           return "U";
            case Key.KeyV:           return "V";
            case Key.KeyW:           return "W";
            case Key.KeyX:           return "X";
            case Key.KeyY:           return "Y";
            case Key.KeyZ:           return "Z";

            case Key.Digit0:         return "0";
            case Key.Digit1:         return "1";
            case Key.Digit2:         return "2";
            case Key.Digit3:         return "3";
            case Key.Digit4:         return "4";
            case Key.Digit5:         return "5";
            case Key.Digit6:         return "6";
            case Key.Digit7:         return "7";
            case Key.Digit8:         return "8";
            case Key.Digit9:         return "9";

            case Key.Numpad0:        return "0<sup><font size=1>N</font></sup>";
            case Key.Numpad1:        return "1<sup><font size=1>N</font></sup>";
            case Key.Numpad2:        return "2<sup><font size=1>N</font></sup>";
            case Key.Numpad3:        return "3<sup><font size=1>N</font></sup>";
            case Key.Numpad4:        return "4<sup><font size=1>N</font></sup>";
            case Key.Numpad5:        return "5<sup><font size=1>N</font></sup>";
            case Key.Numpad6:        return "6<sup><font size=1>N</font></sup>";
            case Key.Numpad7:        return "7<sup><font size=1>N</font></sup>";
            case Key.Numpad8:        return "8<sup><font size=1>N</font></sup>";
            case Key.Numpad9:        return "9<sup><font size=1>N</font></sup>";
            
            case Key.ArrowUp:        return "&#8679;";
            case Key.ArrowLeft:      return "&#8678;";
            case Key.ArrowRight:     return "&#8680;";
            case Key.ArrowDown:      return "&#8681;";

            case Key.Space:          return "&#9251;";

            default:                 return "";
        }
    }
}

export default Key;
