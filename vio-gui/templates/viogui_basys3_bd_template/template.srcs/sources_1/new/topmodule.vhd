library ieee;
use ieee.std_logic_1164.all;
use ieee.std_logic_unsigned.all;

entity topmodule is
    port (
        sys_clk: in  std_logic;
        sw     : in  std_logic_vector(15 downto 0);
        btn    : in  std_logic_vector( 4 downto 0);
        led    : out std_logic_vector(15 downto 0);
        seg    : out std_logic_vector( 7 downto 0); 
        seg_an : out std_logic_vector( 3 downto 0) 
    );
end topmodule;

architecture arch of topmodule is
    signal vSW   : std_logic_vector(15 downto 0);
    signal vLED  : std_logic_vector(15 downto 0);
    signal vSEG0 : std_logic_vector( 7 downto 0);
    signal vSEG1 : std_logic_vector( 7 downto 0);
    signal vSEG2 : std_logic_vector( 7 downto 0);
    signal vSEG3 : std_logic_vector( 7 downto 0);
    signal vBTN  : std_logic_vector( 4 downto 0);
begin

    vio_inst: entity work.vio_basys3_adapter 
        port map (
            clk      => sys_clk,

            i_switch => sw,
            i_button => btn,
            o_led    => led,
            o_seg    => seg,
            o_seg_an => seg_an,

            i_led    => vLED,
            i_seg_0  => vSEG0,
            i_seg_1  => vSEG1,
            i_seg_2  => vSEG2,
            i_seg_3  => vSEG3,
            o_switch => vSW,
            o_button => vBTN
        );

    exercise_inst: entity work.ExerciseBD 
        port map(
            CLK   => sys_clk,
            -- inputs
            SW0   => vSW(0),
            SW1   => vSW(1),
            SW2   => vSW(2),
            SW3   => vSW(3),
            SW4   => vSW(4),
            SW5   => vSW(5),
            SW6   => vSW(6),
            SW7   => vSW(7),
            SW8   => vSW(8),
            SW9   => vSW(9),
            SW10  => vSW(10),
            SW11  => vSW(11),
            SW12  => vSW(12),
            SW13  => vSW(13),
            SW14  => vSW(14),
            SW15  => vSW(15),
            BTNU  => vBTN(0),
            BTNR  => vBTN(1),
            BTND  => vBTN(2),
            BTNL  => vBTN(3),
            BTNC  => vBTN(4),
            -- outputs
			LD0   => vLED(0),
            LD1   => vLED(1),
            LD2   => vLED(2),
            LD3   => vLED(3),
            LD4   => vLED(4),
            LD5   => vLED(5),
            LD6   => vLED(6),
            LD7   => vLED(7),
            LD8   => vLED(8),
            LD9   => vLED(9),
            LD10  => vLED(10),
            LD11  => vLED(11),
            LD12  => vLED(12),
            LD13  => vLED(13),
            LD14  => vLED(14),
            LD15  => vLED(15),
			SEG0  => vSEG0,
			SEG1  => vSEG1,
			SEG2  => vSEG2,
			SEG3  => vSEG3
        );
    
end arch;
