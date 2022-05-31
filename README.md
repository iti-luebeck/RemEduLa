# RemEduLa
We introduce RemEduLa - **Rem**ote **Edu**cational **La**boratory for FPGA design technology to address the problem of increasing hardware complexity and the resulting challenges in teaching hardware design . The core idea is to provide a remote development experience as close as possible to on-site development. For this purpose, FPGAs have been integrated into a system of rack based components and a customizable template project for the FPGAs is provided, which consists of a wrapper design with virtual inputs and outputs. This way RemEduLa enables full control over the FPGA-developing-board. This includes buttons, LEDs, and external peripherals (sensors, actuators).

RemEduLa was first presented as part of the ISCAS 2022 educational track. See the paper for a concise introduction of the whole system: **Paper to be added after publication**. For the purpose of enabling an adoption of the system by other institutions and especially educators, this repository contains the software that was custom written for the system as well as configurations for the third-party software used.

The Remote Education Lab consists of six components: 
- First, the Virtual Machine, which is accessible by VMware Horizon which is needed to connect to the FPGAs from outside the network. 
- The Vivado HW server, which controls the JTAG connection to the FPGAs. Namele Basys3, ZedBoard and PYNQ boards. 
- Each type of FPGA is grouped on a carrier-board and is described in more detail later. 
- The ZedBoards and the PYNQs are connected to the video capture system. The video capture system provides its streams to a web server via the RTS-Protocol. 
- The camera live-view of each Basys3 carrier-board, which allows an interaction similar to on-site development. The camera system also sends the streams to the web server. 
- The web server implements the VIO GUI, which is the web interface to control and monitor the FPGAs remotely. Moreover, it can embed the streams of the camera and the video capture.
![RemEduLa Rack Overview](https://github.com/iti-luebeck/RemEduLa/blob/main/CAD/Renderings/lq/system-overview-c.png?raw=true)


### Rack Components
RemEduLa is a modular rack-based system consisting of various carrier-boards addressing different purposes. There are three different types of carrier boards: 
- The development board carriers house multiple FPGAs of each kind. In our case, we are using three different carriers for Basys3, ZedBoard, and PYNQ development boards. 
- The second carrier type is for supporting infrastructure - e.g. video streaming and video capturing. 
- Third, the gateway carrier, which manages the access to the development boards and the supporting infrastructure.  
For improved modularity and easy access, all connections from and to a carrier-board are realized via standard keystone modules in its front panel.
![RemEduLa Board Carriers](https://github.com/iti-luebeck/RemEduLa/blob/main/figures/board-carriers.png?raw=true)

### Virtual Desktop Environment
The equipment during on-site deleopment conventionally consists of a PC (software, driver, configurations) and an FPGA/development-board. A network layer was added to most of the components, which enables remote access. Particularly important are the Vivado hardware server and the web server for the VIO GUI and camera/video streaming. 
The open ports for remote access would create some security vulnerabilities, because some of the applications do not include any user management. To bypass these problems, the Virtual Desktop Infrastructure (VDI) system by VMware Horizon 8 was introduced. This system is hosted on local server infrastructure and allows a to have a virtual machine with all required software, drivers, and configurations. All the rack components and VMs are grouped in the same IP network, which simplifies the access control and mitigates the security issues. 
![RemEduLa Components](https://github.com/iti-luebeck/RemEduLa/blob/main/figures/vLab.pdf?raw=true)