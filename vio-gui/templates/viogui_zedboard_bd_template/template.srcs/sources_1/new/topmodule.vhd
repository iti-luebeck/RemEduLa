library ieee;
use ieee.std_logic_1164.all;
use ieee.std_logic_unsigned.all;

entity topmodule is
    port (
        clk : in  std_logic;
        sw  : in  std_logic_vector(7 downto 0);
        btn : in  std_logic_vector(4 downto 0);
        led : out std_logic_vector(7 downto 0)
    );
end topmodule;

architecture arch of topmodule is
    signal vSW  : std_logic_vector(7 downto 0);
    signal vLED : std_logic_vector(7 downto 0);
    signal vBTN : std_logic_vector(4 downto 0);
begin
    vio_inst: entity work.ZedBoardVio 
        port map (
            clk      => clk,
            i_led    => vLED,
            i_switch => sw,
            i_button => btn,
            o_led    => led,
            o_switch => vSW,
            o_button => vBTN
        );

    exercise_inst: entity work.ExerciseBD 
        port map(
            CLK => CLK,
            -- inputs
            SW0  => vSW(0), 
            SW1  => vSW(1), 
            SW2  => vSW(2),
            SW3  => vSW(3),
            SW4  => vSW(4),
            SW5  => vSW(5),
            SW6  => vSW(6),
            SW7  => vSW(7),
            BTNU => vBTN(0),
            BTNR => vBTN(1),
            BTND => vBTN(2),
            BTNL => vBTN(3),
            BTNC => vBTN(4),
            -- outputs
            LD0 => LD(0),
            LD1 => LD(1),
            LD2 => LD(2),
            LD3 => LD(3),
            LD4 => LD(4),
            LD5 => LD(5),
            LD6 => LD(6),
            LD7 => LD(7)
        );
    
end arch;
