library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity vio_basys3_adapter is
    port ( 
        clk      : in  std_logic;

        i_led    : in  std_logic_vector(15 downto 0) := (others => '0');
        i_seg_0  : in  std_logic_vector( 7 downto 0) := (others => '0');
        i_seg_1  : in  std_logic_vector( 7 downto 0) := (others => '0');
        i_seg_2  : in  std_logic_vector( 7 downto 0) := (others => '0');
        i_seg_3  : in  std_logic_vector( 7 downto 0) := (others => '0');
        i_button : in  std_logic_vector( 4 downto 0) := (others => '0');
        i_switch : in  std_logic_vector(15 downto 0) := (others => '0');

        o_led    : out std_logic_vector(15 downto 0);
		o_seg    : out std_logic_vector( 7 downto 0);
        o_seg_an : out std_logic_vector( 3 downto 0);
        o_button : out std_logic_vector( 4 downto 0);
        o_switch : out std_logic_vector(15 downto 0)
    );
end vio_basys3_adapter;

architecture rtl of vio_basys3_adapter is
    signal vio_active : std_logic_vector( 7 downto 0);
    signal vio_switch : std_logic_vector(15 downto 0);
    signal vio_button : std_logic_vector( 7 downto 0);

    constant vio_identifier: std_logic_vector(79 downto 0) := x"00000042415359535F33"; -- BASYS_3
    constant vio_index     : std_logic_vector( 7 downto 0) := x"00";
begin
    o_switch <= vio_switch when vio_active(0) = '1' else i_switch;
    o_button <= vio_button(4 downto 0) when vio_active(0) = '1' else i_button;

    vio_basys3_inst: entity work.vio_basys3 port map (
        clk        => clk, 
        probe_in0  => vio_identifier,
        probe_in1  => vio_index,

        probe_in2  => i_led,
        probe_in3  => i_seg_0,
        probe_in4  => i_seg_1,
        probe_in5  => i_seg_2,
        probe_in6  => i_seg_3,
        probe_out0 => vio_active,
        probe_out1 => vio_switch,
        probe_out2 => vio_button 
    );
	
	o_led <= i_led;

	seven_seg_gen: process (clk)
        variable clk_counter : integer := 0;
        variable counter     : integer := 0;
    begin
        if rising_edge(clk) then
            clk_counter := clk_counter + 1;
            if (clk_counter = 65536) then
                clk_counter := 0;
            end if;
			
			if (clk_counter = 0) then
				counter := counter + 1;
				if (counter = 4) then
                    counter := 0;
                end if;
			end if;
			
			case (counter) is
				when 0 => 
					o_seg <= not i_seg_0;
					o_seg_an <= "1110";
				when 1 => 
					o_seg <= not i_seg_1;
					o_seg_an <= "1101";
				when 2 => 
					o_seg <= not i_seg_2;
					o_seg_an <= "1011";
				when 3 => 
					o_seg <= not i_seg_3;
					o_seg_an <= "0111";
                when others => null;
			end case;
        end if;
    end process seven_seg_gen;
	
end rtl; -- vio_basys3_adapter