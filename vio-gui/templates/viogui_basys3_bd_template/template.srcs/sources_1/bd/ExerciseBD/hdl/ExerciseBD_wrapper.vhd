--Copyright 1986-2020 Xilinx, Inc. All Rights Reserved.
----------------------------------------------------------------------------------
--Tool Version: Vivado v.2020.1 (win64) Build 2902540 Wed May 27 19:54:49 MDT 2020
--Date        : Wed Jun  9 10:50:50 2021
--Host        : DESKTOP-1T30SCE running 64-bit major release  (build 9200)
--Command     : generate_target ExerciseBD_wrapper.bd
--Design      : ExerciseBD_wrapper
--Purpose     : IP block netlist
----------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
library UNISIM;
use UNISIM.VCOMPONENTS.ALL;
entity ExerciseBD_wrapper is
  port (
    BTNC : in STD_LOGIC;
    BTND : in STD_LOGIC;
    BTNL : in STD_LOGIC;
    BTNR : in STD_LOGIC;
    BTNU : in STD_LOGIC;
    CLK : in STD_LOGIC;
    LD0 : out STD_LOGIC;
    LD1 : out STD_LOGIC;
    LD10 : out STD_LOGIC;
    LD11 : out STD_LOGIC;
    LD12 : out STD_LOGIC;
    LD13 : out STD_LOGIC;
    LD14 : out STD_LOGIC;
    LD15 : out STD_LOGIC;
    LD2 : out STD_LOGIC;
    LD3 : out STD_LOGIC;
    LD4 : out STD_LOGIC;
    LD5 : out STD_LOGIC;
    LD6 : out STD_LOGIC;
    LD7 : out STD_LOGIC;
    LD8 : out STD_LOGIC;
    LD9 : out STD_LOGIC;
    SEG0 : out STD_LOGIC_VECTOR ( 7 downto 0 );
    SEG1 : out STD_LOGIC_VECTOR ( 7 downto 0 );
    SEG2 : out STD_LOGIC_VECTOR ( 7 downto 0 );
    SEG3 : out STD_LOGIC_VECTOR ( 7 downto 0 );
    SW0 : in STD_LOGIC;
    SW1 : in STD_LOGIC;
    SW10 : in STD_LOGIC;
    SW11 : in STD_LOGIC;
    SW12 : in STD_LOGIC;
    SW13 : in STD_LOGIC;
    SW14 : in STD_LOGIC;
    SW15 : in STD_LOGIC;
    SW2 : in STD_LOGIC;
    SW3 : in STD_LOGIC;
    SW4 : in STD_LOGIC;
    SW5 : in STD_LOGIC;
    SW6 : in STD_LOGIC;
    SW7 : in STD_LOGIC;
    SW8 : in STD_LOGIC;
    SW9 : in STD_LOGIC
  );
end ExerciseBD_wrapper;

architecture STRUCTURE of ExerciseBD_wrapper is
  component ExerciseBD is
  port (
    BTNC : in STD_LOGIC;
    BTND : in STD_LOGIC;
    BTNL : in STD_LOGIC;
    BTNR : in STD_LOGIC;
    BTNU : in STD_LOGIC;
    LD0 : out STD_LOGIC;
    LD1 : out STD_LOGIC;
    LD2 : out STD_LOGIC;
    LD3 : out STD_LOGIC;
    LD4 : out STD_LOGIC;
    LD5 : out STD_LOGIC;
    LD6 : out STD_LOGIC;
    LD7 : out STD_LOGIC;
    SW0 : in STD_LOGIC;
    SW1 : in STD_LOGIC;
    SW2 : in STD_LOGIC;
    SW3 : in STD_LOGIC;
    SW4 : in STD_LOGIC;
    SW5 : in STD_LOGIC;
    SW6 : in STD_LOGIC;
    SW7 : in STD_LOGIC;
    CLK : in STD_LOGIC;
    SW8 : in STD_LOGIC;
    SW9 : in STD_LOGIC;
    SW10 : in STD_LOGIC;
    SW11 : in STD_LOGIC;
    SW12 : in STD_LOGIC;
    SW13 : in STD_LOGIC;
    SW14 : in STD_LOGIC;
    SW15 : in STD_LOGIC;
    LD8 : out STD_LOGIC;
    LD9 : out STD_LOGIC;
    LD10 : out STD_LOGIC;
    LD11 : out STD_LOGIC;
    LD12 : out STD_LOGIC;
    LD13 : out STD_LOGIC;
    LD14 : out STD_LOGIC;
    LD15 : out STD_LOGIC;
    SEG0 : out STD_LOGIC_VECTOR ( 7 downto 0 );
    SEG1 : out STD_LOGIC_VECTOR ( 7 downto 0 );
    SEG2 : out STD_LOGIC_VECTOR ( 7 downto 0 );
    SEG3 : out STD_LOGIC_VECTOR ( 7 downto 0 )
  );
  end component ExerciseBD;
begin
ExerciseBD_i: component ExerciseBD
     port map (
      BTNC => BTNC,
      BTND => BTND,
      BTNL => BTNL,
      BTNR => BTNR,
      BTNU => BTNU,
      CLK => CLK,
      LD0 => LD0,
      LD1 => LD1,
      LD10 => LD10,
      LD11 => LD11,
      LD12 => LD12,
      LD13 => LD13,
      LD14 => LD14,
      LD15 => LD15,
      LD2 => LD2,
      LD3 => LD3,
      LD4 => LD4,
      LD5 => LD5,
      LD6 => LD6,
      LD7 => LD7,
      LD8 => LD8,
      LD9 => LD9,
      SEG0(7 downto 0) => SEG0(7 downto 0),
      SEG1(7 downto 0) => SEG1(7 downto 0),
      SEG2(7 downto 0) => SEG2(7 downto 0),
      SEG3(7 downto 0) => SEG3(7 downto 0),
      SW0 => SW0,
      SW1 => SW1,
      SW10 => SW10,
      SW11 => SW11,
      SW12 => SW12,
      SW13 => SW13,
      SW14 => SW14,
      SW15 => SW15,
      SW2 => SW2,
      SW3 => SW3,
      SW4 => SW4,
      SW5 => SW5,
      SW6 => SW6,
      SW7 => SW7,
      SW8 => SW8,
      SW9 => SW9
    );
end STRUCTURE;
