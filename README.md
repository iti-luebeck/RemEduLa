# RemEduLa
We introduce RemEduLa - **Rem**ote **Edu**cational **La**boratory for FPGA design technology to address the problem of increasing hardware complexity and the resulting challenges in teaching hardware design . The core idea is to provide a remote development experience as close as possible to on-site development. For this purpose, FPGAs have been integrated into a system of rack based components and a customizable template project for the FPGAs is provided, which consists of a wrapper design with virtual inputs and outputs. This way RemEduLa enables full control over the FPGA-developing-board. This includes buttons, LEDs, and external peripherals (sensors, actuators).

RemEduLa was first presented as part of the ISCAS 2022 educational track. See the paper for a concise introduction of the whole system: **Paper to be added after publication**. For the purpose of enabling an adoption of the system by other institutions and especially educators, this repository contains the software that was custom written for the system as well as configurations for the third-party software used.

## System Overview
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
![RemEduLa Components](https://github.com/iti-luebeck/RemEduLa/blob/main/figures/vLab.png?raw=true)
### Virtual Desktop Environment
The equipment during on-site deleopment conventionally consists of a PC (software, driver, configurations) and an FPGA/development-board. A network layer was added to most of the components, which enables remote access. Particularly important are the Vivado hardware server and the web server for the VIO GUI and camera/video streaming. 
The open ports for remote access would create some security vulnerabilities, because some of the applications do not include any user management. To bypass these problems, the Virtual Desktop Infrastructure (VDI) system by VMware Horizon 8 was introduced. This system is hosted on local server infrastructure and allows a to have a virtual machine with all required software, drivers, and configurations. All the rack components and VMs are grouped in the same IP network, which simplifies the access control and mitigates the security issues. 
![RemEduLa Overlay](https://github.com/iti-luebeck/RemEduLa/blob/main/figures/Overlay.png?raw=true)
### VIO GUI Web Interface
The VIO GUI is a web application that primarily acts as a customizable user interface to control the VIO IP-Cores in the generated design. The application utilizes the WebSocket API to connect to the hardware server and communicate with the VIO IP-Core. In the current setup, the video stream player also utilizes the WebSocket API to receive the video data, although alternative streaming implementations could also be used. Depending on the use case requirements, the more efficient WebRTC API could be used, which also provides real-time video communication. 
![RemEduLa Overlay](https://github.com/iti-luebeck/RemEduLa/blob/main/figures/VIO-GUI.png?raw=true)

## Video Stream Platform
Sometimes, remotely working on the FPGA includes the necessity of accessing the onboard video interfaces. Namely, the utilized ZedBoards are capable of outputting analogue video through VGA while the Pynq Z1 boards receive and send digital video as well as audio through HDMI. This section specifically contains additional information that was ommitted from the paper linked earlier.
![RemEduLa Overlay](https://github.com/iti-luebeck/RemEduLa/blob/main/figures/video-chain.png?raw=true)
### Video Input
For the Pynq boards included in the setup, a video source had to be provided to enable remote processing of video streams. The source for the video input and the devices capturing the video inputs were decidedly kept separate to distribute the load on the systems and minimize possible interference when changes to the video material are necessary. Lightweight third-generation Raspberry Pis were deployed as the video sources. 
Since all boards need a video input stream, but it is sufficient for them to be identical, the signal is split using HDMI splitters. 
### Video Output
The analogue output of the ZedBoards is converted using an active converter that additionally receives audio through the 3.5mm jack on the ZedBoard and combines the signals to achieve a fully-featured HDMI signal. By first applying this conversion, a homogeneous environment is created in which no further distinction by the signal source is necessary.
To be able to monitor the output remotely, it is necessary to capture the video signals. A variety of capture cards are available for this purpose. USB2 capture cards are the cheapest but run into limitations when used on USB hubs since even USB3 hubs offer only USB2 badwidths to USB2 devices. Ideally, each capture card should be connected to its own USB port and no separate ports should share a hub internally. The Via Labs VL805-Q6 USB controller was identified as a fitting candidate due to its four separate internal ports. Multiple cards containing this controller were fitted to PCIe expanders. In this configuration, each board is directly connected to a dedicated capture card. In addition to the relatively high complexity of this setup, the number of resulting streams requires a powerful  PC for further processing.
Therefore, as another approach, multi viewers were used to combine multiple board outputs into a single video stream to be captured. The multi viewer composites 16 1080p streams into a grid of four by four streams with a combined 4k resolution. This however adds complexity when audio is also to be captured since audio send to the multi viewer via HDMI is lost.
### Video Software and Streams
The USB capture cards are treated like webcams by the PC they are connected to. The Open Broadcast Software (OBS) application OBS Studio is used for scene composition and streaming.
For load balancing, the capture PC should only sever a limited number of clients. It therefore streams the video composited of multiple board outputs as a single stream. This stream is then received by an nginx instance running in a VM and in combination with ffmpeg, separate streams for each board are extracted from the composite and can be embedded into any HTML document.
