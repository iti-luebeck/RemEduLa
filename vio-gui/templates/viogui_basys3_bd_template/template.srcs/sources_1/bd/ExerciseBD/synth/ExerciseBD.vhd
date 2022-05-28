--Copyright 1986-2020 Xilinx, Inc. All Rights Reserved.
----------------------------------------------------------------------------------
--Tool Version: Vivado v.2020.1 (win64) Build 2902540 Wed May 27 19:54:49 MDT 2020
--Date        : Wed Jun  9 10:50:50 2021
--Host        : DESKTOP-1T30SCE running 64-bit major release  (build 9200)
--Command     : generate_target ExerciseBD.bd
--Design      : ExerciseBD
--Purpose     : IP block netlist
----------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
library UNISIM;
use UNISIM.VCOMPONENTS.ALL;
entity ExerciseBD is
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
  attribute CORE_GENERATION_INFO : string;
  attribute CORE_GENERATION_INFO of ExerciseBD : entity is "ExerciseBD,IP_Integrator,{x_ipVendor=xilinx.com,x_ipLibrary=BlockDiagram,x_ipName=ExerciseBD,x_ipVersion=1.00.a,x_ipLanguage=VHDL,numBlks=0,numReposBlks=0,numNonXlnxBlks=0,numHierBlks=0,maxHierDepth=0,numSysgenBlks=0,numHlsBlks=0,numHdlrefBlks=0,numPkgbdBlks=0,bdsource=USER,synth_mode=OOC_per_IP}";
  attribute HW_HANDOFF : string;
  attribute HW_HANDOFF of ExerciseBD : entity is "ExerciseBD.hwdef";
end ExerciseBD;

architecture STRUCTURE of ExerciseBD is
  signal SW0_1 : STD_LOGIC;
  signal SW10_1 : STD_LOGIC;
  signal SW11_1 : STD_LOGIC;
  signal SW12_1 : STD_LOGIC;
  signal SW1_1 : STD_LOGIC;
  signal SW2_1 : STD_LOGIC;
  signal SW3_1 : STD_LOGIC;
  signal SW4_1 : STD_LOGIC;
  signal SW5_1 : STD_LOGIC;
  signal SW6_1 : STD_LOGIC;
  signal SW7_1 : STD_LOGIC;
  signal SW8_1 : STD_LOGIC;
  signal SW9_1 : STD_LOGIC;
  attribute X_INTERFACE_INFO : string;
  attribute X_INTERFACE_INFO of CLK : signal is "xilinx.com:signal:clock:1.0 CLK.CLK CLK";
  attribute X_INTERFACE_PARAMETER : string;
  attribute X_INTERFACE_PARAMETER of CLK : signal is "XIL_INTERFACENAME CLK.CLK, CLK_DOMAIN ExerciseBD_CLK, FREQ_HZ 100000000, FREQ_TOLERANCE_HZ 0, INSERT_VIP 0, PHASE 0.000";
  attribute X_INTERFACE_INFO of SEG0 : signal is "xilinx.com:signal:data:1.0 DATA.SEG0 DATA";
  attribute X_INTERFACE_PARAMETER of SEG0 : signal is "XIL_INTERFACENAME DATA.SEG0, LAYERED_METADATA undef";
  attribute X_INTERFACE_INFO of SEG1 : signal is "xilinx.com:signal:data:1.0 DATA.SEG1 DATA";
  attribute X_INTERFACE_PARAMETER of SEG1 : signal is "XIL_INTERFACENAME DATA.SEG1, LAYERED_METADATA undef";
  attribute X_INTERFACE_INFO of SEG2 : signal is "xilinx.com:signal:data:1.0 DATA.SEG2 DATA";
  attribute X_INTERFACE_PARAMETER of SEG2 : signal is "XIL_INTERFACENAME DATA.SEG2, LAYERED_METADATA undef";
  attribute X_INTERFACE_INFO of SEG3 : signal is "xilinx.com:signal:data:1.0 DATA.SEG3 DATA";
  attribute X_INTERFACE_PARAMETER of SEG3 : signal is "XIL_INTERFACENAME DATA.SEG3, LAYERED_METADATA undef";
begin
  LD0 <= SW0_1;
  LD1 <= SW1_1;
  LD2 <= SW2_1;
  LD3 <= SW3_1;
  LD4 <= SW4_1;
  LD5 <= SW5_1;
  LD6 <= SW6_1;
  LD7 <= SW7_1;
  LD8 <= SW8_1;
  SEG0(0) <= SW9_1;
  SEG1(0) <= SW10_1;
  SEG2(0) <= SW11_1;
  SEG3(0) <= SW12_1;
  SW0_1 <= SW0;
  SW10_1 <= SW10;
  SW11_1 <= SW11;
  SW12_1 <= SW12;
  SW1_1 <= SW1;
  SW2_1 <= SW2;
  SW3_1 <= SW3;
  SW4_1 <= SW4;
  SW5_1 <= SW5;
  SW6_1 <= SW6;
  SW7_1 <= SW7;
  SW8_1 <= SW8;
  SW9_1 <= SW9;
  LD10 <= 'Z';
  LD11 <= 'Z';
  LD12 <= 'Z';
  LD13 <= 'Z';
  LD14 <= 'Z';
  LD15 <= 'Z';
  LD9 <= 'Z';
  SEG0(1) <= 'Z';
  SEG0(2) <= 'Z';
  SEG0(3) <= 'Z';
  SEG0(4) <= 'Z';
  SEG0(5) <= 'Z';
  SEG0(6) <= 'Z';
  SEG0(7) <= 'Z';
  SEG1(1) <= 'Z';
  SEG1(2) <= 'Z';
  SEG1(3) <= 'Z';
  SEG1(4) <= 'Z';
  SEG1(5) <= 'Z';
  SEG1(6) <= 'Z';
  SEG1(7) <= 'Z';
  SEG2(1) <= 'Z';
  SEG2(2) <= 'Z';
  SEG2(3) <= 'Z';
  SEG2(4) <= 'Z';
  SEG2(5) <= 'Z';
  SEG2(6) <= 'Z';
  SEG2(7) <= 'Z';
  SEG3(1) <= 'Z';
  SEG3(2) <= 'Z';
  SEG3(3) <= 'Z';
  SEG3(4) <= 'Z';
  SEG3(5) <= 'Z';
  SEG3(6) <= 'Z';
  SEG3(7) <= 'Z';
end STRUCTURE;
