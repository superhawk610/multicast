<br />
<br />
<p align="center">
  <img src="images/multicast.png" width=250 />
</p>
<br />

<h2 align="center"><strong>MultiCast</strong></h2>
<p align="center">
  A persistent solution to presenting content across multiple Chromecast devices, inspired by <a href="http://greenscreen.io/">Greenscreen</a>.
</p>

<p align="center">
  Developed with <a href="https://github.com/nodejs/node">Node</a>, <a href="https://github.com/facebook/react">React</a>, and <a href="https://github.com/apollographql">Apollo</a>.
</p>

<br />
<p align="center">
  <img alt="pre-release v3.0" src="https://img.shields.io/static/v1.svg?label=pre-release&message=v3.0.0-beta.1&color=brightgreen" />
  <img alt="travis-build" src="https://img.shields.io/travis/superhawk610/multicast/master.svg" />
</p>
<br />

## PRE-RELEASE

This branch is in an **unstable**, **pre-release** state. Use at your own risk. You've been warned.

## Usage

TODO: Usage instructions.

## Getting Started

### Prerequisites

This project requires Node.js and NPM (bundled with Node), as well as a MongoDB server. Since Node is cross-platform, it should work on Windows, MacOS, and Linux.

This project depends on [node_mdns](https://github.com/agnat/node_mdns), which in turn requires a mDNS stack. Follow the installation instructions [here](https://github.com/agnat/node_mdns#installation) for whichever platform you are on to install a mDNS stack. If you're on Linux, this is as simple as

#### Debian/Ubuntu

```shell
sudo apt-get install build-essential libavahi-compat-libdnssd-dev
```

#### RedHat/Fedora/CentOS

```shell
sudo yum install gcc gcc-c++ avahi avahi-compat-libdns_sd avahi-compat-libdns_sd-devel nss_mdns
```

### Setup

Grab the latest stable copy of Node/NPM from [here](https://nodejs.org/en/download/) or install it via [nvm](http://nvm.sh).

In order to access the Chromecast API, you need to [register as a Cast developer](https://cast.google.com/publish/) (it costs \$5).

Once you've done this, log in to the [Cast Developer SDK Console](https://cast.google.com/u/1/publish/#/overview) and click **Add New Application**. Choose **Custom Receiver**, then name it `Multicast` and set the **Receiver Application URL** to `http://YOUR_LOCAL_IP:3944/landing`. Disable **Guest Mode** and then **Save**.

**NOTE:** Make sure to use your LAN IP here (192.168.1.xx or similar), not your WAN/external IP. This should resolve to your server only within your local network.

You now need to register your Chromecast devices as developer devices. For each device, locate the Serial Number (located on the back of the device and on the box), click **Add New Device**, and enter the Serial Number and a brief Description. (**NOTE**: This may take up to 15 minutes to take effect. Go grab a cup of coffee and then head back.)

TODO: Application-specific installation instructions.

### Firewall Settings

In order for a Chromecast to establish and maintain a connection with a Cast sender, the sender must open two ports:

```html
1900/UDP (DIAL) 5353/UDP (mDNS)
```

Make sure that the device running MultiCast has these ports open, as well as the standard HTTP ports

```html
80/TCP/UDP (HTTP) 443/TCP/UDP (HTTPS)
```

## Having Trouble?

### Common Errors

```html
*** WARNING *** The program 'nodejs' uses the Apple Bonjour compatibility layer of Avahi.
*** WARNING *** Please fix your application to use the native API of Avahi!
*** WARNING *** For more information see http://0pointer.de/avahi-compat?s=libdns_sd&e=nodejs
*** WARNING *** The program 'nodejs' called 'DNSServiceRegister()' which is not supported (or only supported partially) in the Apple Bonjour compatibility layer of Avahi.
*** WARNING *** Please fix your application to use the native API of Avahi!
*** WARNING *** For more information see http://0pointer.de/avahi-compat?s=libdns_sd&e=nodejs&f=DNSServiceRegister
```

Don't worry about this. This warning shows up in all Node apps on Linux that depend on `libavahi-compat-libdnssd-dev`. You can safely ignore it.

**Multicast can't find your devices?**
Make sure they've already been setup and powered on and the display that they're connected to is powered on and displaying their output.

If you can view them from other Cast-enabled apps but not from Multicast, its likely an issue with your firewall. Make sure you configured your firewall correctly (see [Firewall Settings](#firewall-settings)).

**Running CentOS and Seeing This Error?**

```shell
Error: getaddrinfo -3008
```

Make sure you have `nss_mdns` installed:

```shell
sudo yum install nss_mdns
```

### Issues

If you run into any problems while using this, please report them [here](https://github.com/superhawk610/multicast/issues).

## Contributing

See the [contribution guide](CONTRIBUTING.md) for instructions on contributing to the project.

## Security Disclosure

This project relies on [node-castv2](https://github.com/thibauts/node-castv2) which uses an outdated version of [protobuf](https://github.com/dcodeIO/ProtoBuf.js/). Details of the vulnerability can be found [here](https://nvd.nist.gov/vuln/detail/CVE-2018-3738).

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for more details.

## Acknowledgments

Special thanks to [Greenscreen](https://github.com/groupon/greenscreen) and the team over at Groupon for inspiring this product.
