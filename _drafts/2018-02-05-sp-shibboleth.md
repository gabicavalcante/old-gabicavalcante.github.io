---
layout: post
title: "SP Shibboleth"
comments: true
permalink: "sp-shibboleth"
author: Gabriela Cavalcante
tags: [shibboleth]
---

### Add Shibboleth repository for CentOS and Install

```bash
    # yum -y update 
    # yum -y install wget 
    # wget http://download.opensuse.org/repositories/security://shibboleth/CentOS_7/security:shibboleth.repo -P /etc/yum.repos.d   
```

### Shibboleth SP Installation

```bash
    # yum -y install httpd shibboleth.x86_64 mod_ssl 
    # service shibd start
    # chkconfig shibd on
```

### Install and Configure httpd

```bash
    # yum install httpd
    # service httpd start
    # service iptables stop 
```

### Configuration

Edit the file `httpd.conf`, and do the following changes:

  Change the `ServerName` directive to the server name of the SP (for example, sp.shibboleth.example).

  Set `UseCanonicalName On`.

  Restart the httpd service using the command `service httpd restart`.

### Httpd Testing
 
  Create an `index.html` file inside the directory `/var/www/html`.

  Restart the httpd service using the command `service httpd restart`.

  Check from your browser if the file `index.html` is visible.
  
## SP Key Certificate

  Create both a private key, and a certificate, and place those in the file /etc/shibboleth.
  
```bash
    cd /etc/shibboleth
    sudo ./keygen.sh -h sp.shibboleth.example -e https://sp.shibboleth.example/shibboleth -f -y 10
    sudo chown shibd:shibd /etc/shibboleth/sp-key.pem
    sudo chown shibd:shibd /etc/shibboleth/sp-cert.pem
```

  Change the permissions of these files so that the web server can read the files.


references:

* http://accc.uic.edu/answer/how-do-i-install-and-configure-shibboleth
* https://gluu.org/docs/ce/2.4.4/integration/saml-sp/

{% include twitter_plug.html %}
