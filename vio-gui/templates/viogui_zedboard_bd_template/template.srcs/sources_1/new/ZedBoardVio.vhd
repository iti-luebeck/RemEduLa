library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity ZedBoardVio is
    port ( 
        clk      : in  std_logic;
        i_button : in  std_logic_vector(4 downto 0) := (others => '0');
        i_led    : in  std_logic_vector(7 downto 0) := (others => '0');
        i_switch : in  std_logic_vector(7 downto 0) := (others => '0');
        o_button : out std_logic_vector(4 downto 0);
        o_led    : out std_logic_vector(7 downto 0);
        o_switch : out std_logic_vector(7 downto 0)
    );
end ZedBoardVio;

architecture Behavioral of ZedBoardVio is
    constant vio_identifier : std_logic_vector(79 downto 0) := x"005A45445F424F415244"; -- ZED_BOARD
    constant vio_index      : std_logic_vector( 7 downto 0) := x"00";
    
    signal vio_active : std_logic_vector(7 downto 0);
    signal vio_switch : std_logic_vector(7 downto 0);
    signal vio_button : std_logic_vector(7 downto 0);

begin

    o_switch <= vio_switch(7 downto 0) when vio_active(0) = '1' else i_switch;
    o_button <= vio_button(4 downto 0) when vio_active(0) = '1' else i_button;

    vio_inst: entity work.vio_0 port map (
        clk        => clk, 
        probe_in0  => vio_identifier,
        probe_in1  => vio_index,
        probe_in2  => i_led,
        probe_out0 => vio_active,
        probe_out1 => vio_switch,
        probe_out2 => vio_button 
    );
    
    o_led <= i_led;
end Behavioral;
