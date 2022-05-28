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
    vio_inst: entity work.ZedBoardVio port map (
        clk      => clk,
        i_led    => vLED,
        i_switch => sw,
        i_button => btn,
        o_led    => led,
        o_switch => vSW,
        o_button => vBTN
    );

    -- use vSW, vLED and vBTN here
    vLED <= vSW;
    
end arch;
