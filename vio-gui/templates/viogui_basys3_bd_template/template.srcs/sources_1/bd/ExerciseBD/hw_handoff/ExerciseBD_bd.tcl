
################################################################
# This is a generated script based on design: ExerciseBD
#
# Though there are limitations about the generated script,
# the main purpose of this utility is to make learning
# IP Integrator Tcl commands easier.
################################################################

namespace eval _tcl {
proc get_script_folder {} {
   set script_path [file normalize [info script]]
   set script_folder [file dirname $script_path]
   return $script_folder
}
}
variable script_folder
set script_folder [_tcl::get_script_folder]

################################################################
# Check if script is running in correct Vivado version.
################################################################
set scripts_vivado_version 2020.1
set current_vivado_version [version -short]

if { [string first $scripts_vivado_version $current_vivado_version] == -1 } {
   puts ""
   catch {common::send_gid_msg -ssname BD::TCL -id 2041 -severity "ERROR" "This script was generated using Vivado <$scripts_vivado_version> and is being run in <$current_vivado_version> of Vivado. Please run the script in Vivado <$scripts_vivado_version> then open the design in Vivado <$current_vivado_version>. Upgrade the design by running \"Tools => Report => Report IP Status...\", then run write_bd_tcl to create an updated script."}

   return 1
}

################################################################
# START
################################################################

# To test this script, run the following commands from Vivado Tcl console:
# source ExerciseBD_script.tcl

# If there is no project opened, this script will create a
# project, but make sure you do not have an existing project
# <./myproj/project_1.xpr> in the current working folder.

set list_projs [get_projects -quiet]
if { $list_projs eq "" } {
   create_project project_1 myproj -part xc7a35tcpg236-1
}


# CHANGE DESIGN NAME HERE
variable design_name
set design_name ExerciseBD

# If you do not already have an existing IP Integrator design open,
# you can create a design using the following command:
#    create_bd_design $design_name

# Creating design if needed
set errMsg ""
set nRet 0

set cur_design [current_bd_design -quiet]
set list_cells [get_bd_cells -quiet]

if { ${design_name} eq "" } {
   # USE CASES:
   #    1) Design_name not set

   set errMsg "Please set the variable <design_name> to a non-empty value."
   set nRet 1

} elseif { ${cur_design} ne "" && ${list_cells} eq "" } {
   # USE CASES:
   #    2): Current design opened AND is empty AND names same.
   #    3): Current design opened AND is empty AND names diff; design_name NOT in project.
   #    4): Current design opened AND is empty AND names diff; design_name exists in project.

   if { $cur_design ne $design_name } {
      common::send_gid_msg -ssname BD::TCL -id 2001 -severity "INFO" "Changing value of <design_name> from <$design_name> to <$cur_design> since current design is empty."
      set design_name [get_property NAME $cur_design]
   }
   common::send_gid_msg -ssname BD::TCL -id 2002 -severity "INFO" "Constructing design in IPI design <$cur_design>..."

} elseif { ${cur_design} ne "" && $list_cells ne "" && $cur_design eq $design_name } {
   # USE CASES:
   #    5) Current design opened AND has components AND same names.

   set errMsg "Design <$design_name> already exists in your project, please set the variable <design_name> to another value."
   set nRet 1
} elseif { [get_files -quiet ${design_name}.bd] ne "" } {
   # USE CASES: 
   #    6) Current opened design, has components, but diff names, design_name exists in project.
   #    7) No opened design, design_name exists in project.

   set errMsg "Design <$design_name> already exists in your project, please set the variable <design_name> to another value."
   set nRet 2

} else {
   # USE CASES:
   #    8) No opened design, design_name not in project.
   #    9) Current opened design, has components, but diff names, design_name not in project.

   common::send_gid_msg -ssname BD::TCL -id 2003 -severity "INFO" "Currently there is no design <$design_name> in project, so creating one..."

   create_bd_design $design_name

   common::send_gid_msg -ssname BD::TCL -id 2004 -severity "INFO" "Making design <$design_name> as current_bd_design."
   current_bd_design $design_name

}

common::send_gid_msg -ssname BD::TCL -id 2005 -severity "INFO" "Currently the variable <design_name> is equal to \"$design_name\"."

if { $nRet != 0 } {
   catch {common::send_gid_msg -ssname BD::TCL -id 2006 -severity "ERROR" $errMsg}
   return $nRet
}

##################################################################
# DESIGN PROCs
##################################################################



# Procedure to create entire design; Provide argument to make
# procedure reusable. If parentCell is "", will use root.
proc create_root_design { parentCell } {

  variable script_folder
  variable design_name

  if { $parentCell eq "" } {
     set parentCell [get_bd_cells /]
  }

  # Get object for parentCell
  set parentObj [get_bd_cells $parentCell]
  if { $parentObj == "" } {
     catch {common::send_gid_msg -ssname BD::TCL -id 2090 -severity "ERROR" "Unable to find parent cell <$parentCell>!"}
     return
  }

  # Make sure parentObj is hier blk
  set parentType [get_property TYPE $parentObj]
  if { $parentType ne "hier" } {
     catch {common::send_gid_msg -ssname BD::TCL -id 2091 -severity "ERROR" "Parent <$parentObj> has TYPE = <$parentType>. Expected to be <hier>."}
     return
  }

  # Save current instance; Restore later
  set oldCurInst [current_bd_instance .]

  # Set parent object as current
  current_bd_instance $parentObj


  # Create interface ports

  # Create ports
  set BTNC [ create_bd_port -dir I BTNC ]
  set BTND [ create_bd_port -dir I BTND ]
  set BTNL [ create_bd_port -dir I BTNL ]
  set BTNR [ create_bd_port -dir I BTNR ]
  set BTNU [ create_bd_port -dir I BTNU ]
  set CLK [ create_bd_port -dir I -type clk CLK ]
  set LD0 [ create_bd_port -dir O LD0 ]
  set LD1 [ create_bd_port -dir O LD1 ]
  set LD2 [ create_bd_port -dir O LD2 ]
  set LD3 [ create_bd_port -dir O LD3 ]
  set LD4 [ create_bd_port -dir O LD4 ]
  set LD5 [ create_bd_port -dir O LD5 ]
  set LD6 [ create_bd_port -dir O LD6 ]
  set LD7 [ create_bd_port -dir O LD7 ]
  set LD8 [ create_bd_port -dir O LD8 ]
  set LD9 [ create_bd_port -dir O LD9 ]
  set LD10 [ create_bd_port -dir O LD10 ]
  set LD11 [ create_bd_port -dir O LD11 ]
  set LD12 [ create_bd_port -dir O LD12 ]
  set LD13 [ create_bd_port -dir O LD13 ]
  set LD14 [ create_bd_port -dir O LD14 ]
  set LD15 [ create_bd_port -dir O LD15 ]
  set SEG0 [ create_bd_port -dir O -from 7 -to 0 -type data SEG0 ]
  set SEG1 [ create_bd_port -dir O -from 7 -to 0 -type data SEG1 ]
  set SEG2 [ create_bd_port -dir O -from 7 -to 0 -type data SEG2 ]
  set SEG3 [ create_bd_port -dir O -from 7 -to 0 -type data SEG3 ]
  set SW0 [ create_bd_port -dir I SW0 ]
  set SW1 [ create_bd_port -dir I SW1 ]
  set SW2 [ create_bd_port -dir I SW2 ]
  set SW3 [ create_bd_port -dir I SW3 ]
  set SW4 [ create_bd_port -dir I SW4 ]
  set SW5 [ create_bd_port -dir I SW5 ]
  set SW6 [ create_bd_port -dir I SW6 ]
  set SW7 [ create_bd_port -dir I SW7 ]
  set SW8 [ create_bd_port -dir I SW8 ]
  set SW9 [ create_bd_port -dir I SW9 ]
  set SW10 [ create_bd_port -dir I SW10 ]
  set SW11 [ create_bd_port -dir I SW11 ]
  set SW12 [ create_bd_port -dir I SW12 ]
  set SW13 [ create_bd_port -dir I SW13 ]
  set SW14 [ create_bd_port -dir I SW14 ]
  set SW15 [ create_bd_port -dir I SW15 ]

  # Create port connections
  connect_bd_net -net SW0_1 [get_bd_ports LD0] [get_bd_ports SW0]
  connect_bd_net -net SW10_1 [get_bd_ports SEG1] [get_bd_ports SW10]
  connect_bd_net -net SW11_1 [get_bd_ports SEG2] [get_bd_ports SW11]
  connect_bd_net -net SW12_1 [get_bd_ports SEG3] [get_bd_ports SW12]
  connect_bd_net -net SW1_1 [get_bd_ports LD1] [get_bd_ports SW1]
  connect_bd_net -net SW2_1 [get_bd_ports LD2] [get_bd_ports SW2]
  connect_bd_net -net SW3_1 [get_bd_ports LD3] [get_bd_ports SW3]
  connect_bd_net -net SW4_1 [get_bd_ports LD4] [get_bd_ports SW4]
  connect_bd_net -net SW5_1 [get_bd_ports LD5] [get_bd_ports SW5]
  connect_bd_net -net SW6_1 [get_bd_ports LD6] [get_bd_ports SW6]
  connect_bd_net -net SW7_1 [get_bd_ports LD7] [get_bd_ports SW7]
  connect_bd_net -net SW8_1 [get_bd_ports LD8] [get_bd_ports SW8]
  connect_bd_net -net SW9_1 [get_bd_ports SEG0] [get_bd_ports SW9]

  # Create address segments


  # Restore current instance
  current_bd_instance $oldCurInst

  validate_bd_design
  save_bd_design
}
# End of create_root_design()


##################################################################
# MAIN FLOW
##################################################################

create_root_design ""


