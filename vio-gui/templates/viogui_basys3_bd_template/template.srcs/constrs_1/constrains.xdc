## This file is a general .xdc for the Basys3 rev B board
## To use it in a project:
## - uncomment the lines corresponding to used pins
## - rename the used ports (in each line, after get_ports) according to the top level signal names in the project

## Clock signal
set_property PACKAGE_PIN W5 [get_ports sys_clk]
set_property IOSTANDARD LVCMOS33 [get_ports sys_clk]
create_clock -period 10.000 -name sys_clk_pin -waveform {0.000 5.000} -add [get_ports sys_clk]

## Switches
set_property PACKAGE_PIN V17 [get_ports {sw[0]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[0]}]
set_property PACKAGE_PIN V16 [get_ports {sw[1]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[1]}]
set_property PACKAGE_PIN W16 [get_ports {sw[2]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[2]}]
set_property PACKAGE_PIN W17 [get_ports {sw[3]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[3]}]
set_property PACKAGE_PIN W15 [get_ports {sw[4]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[4]}]
set_property PACKAGE_PIN V15 [get_ports {sw[5]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[5]}]
set_property PACKAGE_PIN W14 [get_ports {sw[6]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[6]}]
set_property PACKAGE_PIN W13 [get_ports {sw[7]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[7]}]
set_property PACKAGE_PIN V2 [get_ports {sw[8]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[8]}]
set_property PACKAGE_PIN T3 [get_ports {sw[9]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[9]}]
set_property PACKAGE_PIN T2 [get_ports {sw[10]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[10]}]
set_property PACKAGE_PIN R3 [get_ports {sw[11]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[11]}]
set_property PACKAGE_PIN W2 [get_ports {sw[12]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[12]}]
set_property PACKAGE_PIN U1 [get_ports {sw[13]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[13]}]
set_property PACKAGE_PIN T1 [get_ports {sw[14]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[14]}]
set_property PACKAGE_PIN R2 [get_ports {sw[15]}]
set_property IOSTANDARD LVCMOS33 [get_ports {sw[15]}]


## LEDS
set_property PACKAGE_PIN U16 [get_ports {led[0]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[0]}]
set_property PACKAGE_PIN E19 [get_ports {led[1]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[1]}]
set_property PACKAGE_PIN U19 [get_ports {led[2]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[2]}]
set_property PACKAGE_PIN V19 [get_ports {led[3]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[3]}]
set_property PACKAGE_PIN W18 [get_ports {led[4]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[4]}]
set_property PACKAGE_PIN U15 [get_ports {led[5]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[5]}]
set_property PACKAGE_PIN U14 [get_ports {led[6]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[6]}]
set_property PACKAGE_PIN V14 [get_ports {led[7]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[7]}]
set_property PACKAGE_PIN V13 [get_ports {led[8]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[8]}]
set_property PACKAGE_PIN V3 [get_ports {led[9]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[9]}]
set_property PACKAGE_PIN W3 [get_ports {led[10]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[10]}]
set_property PACKAGE_PIN U3 [get_ports {led[11]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[11]}]
set_property PACKAGE_PIN P3 [get_ports {led[12]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[12]}]
set_property PACKAGE_PIN N3 [get_ports {led[13]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[13]}]
set_property PACKAGE_PIN P1 [get_ports {led[14]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[14]}]
set_property PACKAGE_PIN L1 [get_ports {led[15]}]
set_property IOSTANDARD LVCMOS33 [get_ports {led[15]}]


## 7 Segment Display
set_property PACKAGE_PIN W7 [get_ports {seg[0]}]
set_property IOSTANDARD LVCMOS33 [get_ports {seg[0]}]
set_property PACKAGE_PIN W6 [get_ports {seg[1]}]
set_property IOSTANDARD LVCMOS33 [get_ports {seg[1]}]
set_property PACKAGE_PIN U8 [get_ports {seg[2]}]
set_property IOSTANDARD LVCMOS33 [get_ports {seg[2]}]
set_property PACKAGE_PIN V8 [get_ports {seg[3]}]
set_property IOSTANDARD LVCMOS33 [get_ports {seg[3]}]
set_property PACKAGE_PIN U5 [get_ports {seg[4]}]
set_property IOSTANDARD LVCMOS33 [get_ports {seg[4]}]
set_property PACKAGE_PIN V5 [get_ports {seg[5]}]
set_property IOSTANDARD LVCMOS33 [get_ports {seg[5]}]
set_property PACKAGE_PIN U7 [get_ports {seg[6]}]
set_property IOSTANDARD LVCMOS33 [get_ports {seg[6]}]
set_property PACKAGE_PIN V7 [get_ports {seg[7]}]
set_property IOSTANDARD LVCMOS33 [get_ports {seg[7]}]

set_property PACKAGE_PIN U2 [get_ports {seg_an[0]}]
set_property IOSTANDARD LVCMOS33 [get_ports {seg_an[0]}]
set_property PACKAGE_PIN U4 [get_ports {seg_an[1]}]
set_property IOSTANDARD LVCMOS33 [get_ports {seg_an[1]}]
set_property PACKAGE_PIN V4 [get_ports {seg_an[2]}]
set_property IOSTANDARD LVCMOS33 [get_ports {seg_an[2]}]
set_property PACKAGE_PIN W4 [get_ports {seg_an[3]}]
set_property IOSTANDARD LVCMOS33 [get_ports {seg_an[3]}]


## Buttons
# up
set_property PACKAGE_PIN T18 [get_ports {btn[0]}]
set_property IOSTANDARD LVCMOS33 [get_ports {btn[0]}]
# right
set_property PACKAGE_PIN T17 [get_ports {btn[1]}]
set_property IOSTANDARD LVCMOS33 [get_ports {btn[1]}]
# down
set_property PACKAGE_PIN U17 [get_ports {btn[2]}]
set_property IOSTANDARD LVCMOS33 [get_ports {btn[2]}]
# left
set_property PACKAGE_PIN W19 [get_ports {btn[3]}]
set_property IOSTANDARD LVCMOS33 [get_ports {btn[3]}]
# center
set_property PACKAGE_PIN U18 [get_ports {btn[4]}]
set_property IOSTANDARD LVCMOS33 [get_ports {btn[4]}]


## VGA Connector
set_property PACKAGE_PIN G19 [get_ports {vga_red[0]}]
set_property IOSTANDARD LVCMOS33 [get_ports {vga_red[0]}]
set_property PACKAGE_PIN H19 [get_ports {vga_red[1]}]
set_property IOSTANDARD LVCMOS33 [get_ports {vga_red[1]}]
set_property PACKAGE_PIN J19 [get_ports {vga_red[2]}]
set_property IOSTANDARD LVCMOS33 [get_ports {vga_red[2]}]
set_property PACKAGE_PIN N19 [get_ports {vga_red[3]}]
set_property IOSTANDARD LVCMOS33 [get_ports {vga_red[3]}]
set_property PACKAGE_PIN N18 [get_ports {vga_blue[0]}]
set_property IOSTANDARD LVCMOS33 [get_ports {vga_blue[0]}]
set_property PACKAGE_PIN L18 [get_ports {vga_blue[1]}]
set_property IOSTANDARD LVCMOS33 [get_ports {vga_blue[1]}]
set_property PACKAGE_PIN K18 [get_ports {vga_blue[2]}]
set_property IOSTANDARD LVCMOS33 [get_ports {vga_blue[2]}]
set_property PACKAGE_PIN J18 [get_ports {vga_blue[3]}]
set_property IOSTANDARD LVCMOS33 [get_ports {vga_blue[3]}]
set_property PACKAGE_PIN J17 [get_ports {vga_green[0]}]
set_property IOSTANDARD LVCMOS33 [get_ports {vga_green[0]}]
set_property PACKAGE_PIN H17 [get_ports {vga_green[1]}]
set_property IOSTANDARD LVCMOS33 [get_ports {vga_green[1]}]
set_property PACKAGE_PIN G17 [get_ports {vga_green[2]}]
set_property IOSTANDARD LVCMOS33 [get_ports {vga_green[2]}]
set_property PACKAGE_PIN D17 [get_ports {vga_green[3]}]
set_property IOSTANDARD LVCMOS33 [get_ports {vga_green[3]}]
set_property PACKAGE_PIN P19 [get_ports vga_hsync]
set_property IOSTANDARD LVCMOS33 [get_ports vga_hsync]
set_property PACKAGE_PIN R19 [get_ports vga_vsync]
set_property IOSTANDARD LVCMOS33 [get_ports vga_vsync]


## USB-RS232 Interface
set_property PACKAGE_PIN B18 [get_ports rx]
set_property IOSTANDARD LVCMOS33 [get_ports rx]
set_property PACKAGE_PIN A18 [get_ports tx]
set_property IOSTANDARD LVCMOS33 [get_ports tx]


## Pmod Header JA
# Sch name = JA1
 set_property PACKAGE_PIN J1      [get_ports {ja[0]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {ja[0]}]
# Sch name = JA2
 set_property PACKAGE_PIN L2      [get_ports {ja[1]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {ja[1]}]
# Sch name = JA3
 set_property PACKAGE_PIN J2      [get_ports {ja[2]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {ja[2]}]
# Sch name = JA4
 set_property PACKAGE_PIN G2      [get_ports {ja[3]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {ja[3]}]
# Sch name = JA7
 set_property PACKAGE_PIN H1      [get_ports {ja[4]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {ja[4]}]
# Sch name = JA8
 set_property PACKAGE_PIN K2      [get_ports {ja[5]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {ja[5]}]
# Sch name = JA9
 set_property PACKAGE_PIN H2      [get_ports {ja[6]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {ja[6]}]
# Sch name = JA10
 set_property PACKAGE_PIN G3      [get_ports {ja[7]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {ja[7]}]



## Pmod Header JB
# Sch name = JB1
 set_property PACKAGE_PIN A14     [get_ports {jb[0]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jb[0]}]
# Sch name = JB2
 set_property PACKAGE_PIN A16     [get_ports {jb[1]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jb[1]}]
# Sch name = JB3
 set_property PACKAGE_PIN B15     [get_ports {jb[2]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jb[2]}]
# Sch name = JB4
 set_property PACKAGE_PIN B16     [get_ports {jb[3]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jb[3]}]
# Sch name = JB7
 set_property PACKAGE_PIN A15     [get_ports {jb[4]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jb[4]}]
# Sch name = JB8
 set_property PACKAGE_PIN A17     [get_ports {jb[5]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jb[5]}]
# Sch name = JB9
 set_property PACKAGE_PIN C15     [get_ports {jb[6]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jb[6]}]
# Sch name = JB10
 set_property PACKAGE_PIN C16     [get_ports {jb[7]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jb[7]}]


## Pmod Header JC
# Sch name = JC1
 set_property PACKAGE_PIN K17     [get_ports {jc[0]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jc[0]}]
# Sch name = JC2
 set_property PACKAGE_PIN M18     [get_ports {jc[1]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jc[1]}]
# Sch name = JC3
 set_property PACKAGE_PIN N17     [get_ports {jc[2]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jc[2]}]
# Sch name = JC4
 set_property PACKAGE_PIN P18     [get_ports {jc[3]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jc[3]}]
# Sch name = JC7
 set_property PACKAGE_PIN L17     [get_ports {jc[4]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jc[4]}]
# Sch name = JC8
 set_property PACKAGE_PIN M19     [get_ports {jc[5]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jc[5]}]
# Sch name = JC9
 set_property PACKAGE_PIN P17     [get_ports {jc[6]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jc[6]}]
# Sch name = JC10
 set_property PACKAGE_PIN R18     [get_ports {jc[7]}]
 set_property IOSTANDARD LVCMOS33 [get_ports {jc[7]}]


#Pmod Header JXADC
#Sch name = XA1_P
set_property PACKAGE_PIN J3      [get_ports {vauxp6}]
set_property IOSTANDARD LVCMOS33 [get_ports {vauxp6}]
#Sch name = XA2_P
set_property PACKAGE_PIN L3      [get_ports {vauxp14}]
set_property IOSTANDARD LVCMOS33 [get_ports {vauxp14}]
#Sch name = XA3_P
set_property PACKAGE_PIN M2      [get_ports {vauxp7}]
set_property IOSTANDARD LVCMOS33 [get_ports {vauxp7}]
#Sch name = XA4_P
set_property PACKAGE_PIN N2      [get_ports {vauxp15}]
set_property IOSTANDARD LVCMOS33 [get_ports {vauxp15}]
#Sch name = XA1_N
set_property PACKAGE_PIN K3      [get_ports {vauxn6}]
set_property IOSTANDARD LVCMOS33 [get_ports {vauxn6}]
#Sch name = XA2_N
set_property PACKAGE_PIN M3      [get_ports {vauxn14}]
set_property IOSTANDARD LVCMOS33 [get_ports {vauxn14}]
#Sch name = XA3_N
set_property PACKAGE_PIN M1      [get_ports {vauxn7}]
set_property IOSTANDARD LVCMOS33 [get_ports {vauxn7}]
#Sch name = XA4_N
set_property PACKAGE_PIN N1      [get_ports {vauxn15}]
set_property IOSTANDARD LVCMOS33 [get_ports {vauxn15}]
