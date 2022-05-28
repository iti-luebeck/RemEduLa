//Copyright 1986-2019 Xilinx, Inc. All Rights Reserved.
//--------------------------------------------------------------------------------
//Tool Version: Vivado v.2019.1 (win64) Build 2552052 Fri May 24 14:49:42 MDT 2019
//Date        : Thu Feb  4 15:16:49 2021
//Host        : DESKTOP-1T30SCE running 64-bit major release  (build 9200)
//Command     : generate_target ExerciseBD_wrapper.bd
//Design      : ExerciseBD_wrapper
//Purpose     : IP block netlist
//--------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

module ExerciseBD_wrapper
   (BTNC,
    BTND,
    BTNL,
    BTNR,
    BTNU,
    CLK,
    LD0,
    LD1,
    LD2,
    LD3,
    LD4,
    LD5,
    LD6,
    LD7,
    SW0,
    SW1,
    SW2,
    SW3,
    SW4,
    SW5,
    SW6,
    SW7);
  input BTNC;
  input BTND;
  input BTNL;
  input BTNR;
  input BTNU;
  input CLK;
  output LD0;
  output LD1;
  output LD2;
  output LD3;
  output LD4;
  output LD5;
  output LD6;
  output LD7;
  input SW0;
  input SW1;
  input SW2;
  input SW3;
  input SW4;
  input SW5;
  input SW6;
  input SW7;

  wire BTNC;
  wire BTND;
  wire BTNL;
  wire BTNR;
  wire BTNU;
  wire CLK;
  wire LD0;
  wire LD1;
  wire LD2;
  wire LD3;
  wire LD4;
  wire LD5;
  wire LD6;
  wire LD7;
  wire SW0;
  wire SW1;
  wire SW2;
  wire SW3;
  wire SW4;
  wire SW5;
  wire SW6;
  wire SW7;

  ExerciseBD ExerciseBD_i
       (.BTNC(BTNC),
        .BTND(BTND),
        .BTNL(BTNL),
        .BTNR(BTNR),
        .BTNU(BTNU),
        .CLK(CLK),
        .LD0(LD0),
        .LD1(LD1),
        .LD2(LD2),
        .LD3(LD3),
        .LD4(LD4),
        .LD5(LD5),
        .LD6(LD6),
        .LD7(LD7),
        .SW0(SW0),
        .SW1(SW1),
        .SW2(SW2),
        .SW3(SW3),
        .SW4(SW4),
        .SW5(SW5),
        .SW6(SW6),
        .SW7(SW7));
endmodule
