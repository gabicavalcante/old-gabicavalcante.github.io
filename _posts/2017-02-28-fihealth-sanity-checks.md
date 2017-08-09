---
layout: post
title: FIHealth Sanity Checks
comments: true
tags: [fiware]
permalink: "fihealth-sanity-checks"
author: Gabriela Cavalcante
---


### Build and Install

Baixe o repositorio:

	$ git clone https://github.com/Fiware/ops.Health.git

#### Virtualenv

1. Instale o D-Bus (D-Bus e dbus-python).

2. Cria uma ```virtualenv```:
	
	$ virtualenv $WORKON_HOME/fiware-region-sanity-tests --system-site-packages

3. Ative a ```virtualenv```:

	$ source $WORKON_HOME/fiware-region-sanity-tests/bin/activate

4. Vá para o diretório do FIHealth - Sanity Checks:

	$ cd fiware-health/fiware-region-sanity-tests

5. Instale os pacotes exigidos na ```virtualenv```. Os pacores que devem ser instalados estão no arquivo [requirements.txt](https://github.com/Fiware/ops.Health/blob/master/fiware-region-sanity-tests/requirements.txt).

	$ pip install -r requirements.txt --allow-all-external


### Install and Configure Keystone

Siga as instricuçoes encontradas na [documentaçao do OpenStack](https://docs.openstack.org/mitaka/install-guide-ubuntu/keystone-install.html).


#### mysql

Abra o MySQL cliente e crie o banco de dados "keystone". 

	create database keystone;

Troque *KEYSTONE_DBPASS* com sua senha do banco:

	grant all privileges on keystone.* to 'keystone'@'localhost' identified by '*KEYSTONE_DBPASS*';
  
	grant all privileges on keystone.* to 'keystone'@'%' identified by '*KEYSTONE_DBPASS*';
  
	quit

#### Install the keystone packages:

	# apt-get install keystone apache2 libapache2-mod-wsgi

#### Ative e inicie o memcached service:

	# systemctl enable memcached.service
	# systemctl start memcached.service

#### Configure keystone. 

Substitua *ADMIN_TOKEN* e *KEYSTONE_DBPASS* com os seus valores:

```
# vim /etc/keystone/keystone.conf

  [DEFAULT]
  admin_token = *ADMIN_TOKEN*

  [database]
  connection = mysql://keystone:*KEYSTONE_DBPASS*@controller/keystone

  [memcache]
  servers = localhost:11211

  [token]
  provider = uuid
  driver = memcache
  expiration = 86400

  [revoke]
  driver = sql
```

#### Populate the keystone database:

	# su -s /bin/sh -c "keystone-manage db_sync" keystone

#### Set the Apache server name:
	
```
# vim /etc/httpd/conf/httpd.conf

  ServerName controller
```

#### Configure wsgi:

```
# vim /etc/httpd/conf.d/wsgi-keystone.conf

  Listen 5000
  Listen 35357

  <VirtualHost *:5000>
      WSGIDaemonProcess keystone-public processes=5 threads=1 user=keystone group=keystone display-name=%{GROUP}
      WSGIProcessGroup keystone-public
      WSGIScriptAlias / /usr/bin/keystone-wsgi-public
      WSGIApplicationGroup %{GLOBAL}
      WSGIPassAuthorization On
      <IfVersion >= 2.4>
        ErrorLogFormat "%{cu}t %M"
      </IfVersion>
      ErrorLog /var/log/httpd/keystone-error.log
      CustomLog /var/log/httpd/keystone-access.log combined

      <Directory /usr/bin>
          <IfVersion >= 2.4>
              Require all granted
          </IfVersion>
          <IfVersion < 2.4>
              Order allow,deny
              Allow from all
          </IfVersion>
      </Directory>
  </VirtualHost>

  <VirtualHost *:35357>
      WSGIDaemonProcess keystone-admin processes=5 threads=1 user=keystone group=keystone display-name=%{GROUP}
      WSGIProcessGroup keystone-admin
      WSGIScriptAlias / /usr/bin/keystone-wsgi-admin
      WSGIApplicationGroup %{GLOBAL}
      WSGIPassAuthorization On
      <IfVersion >= 2.4>
        ErrorLogFormat "%{cu}t %M"
      </IfVersion>
      ErrorLog /var/log/httpd/keystone-error.log
      CustomLog /var/log/httpd/keystone-access.log combined

      <Directory /usr/bin>
          <IfVersion >= 2.4>
              Require all granted
          </IfVersion>
          <IfVersion < 2.4>
              Order allow,deny
              Allow from all
          </IfVersion>
      </Directory>
  </VirtualHost>
```

#### Enable and start the Apache service:

	# systemctl enable httpd.service
	# systemctl start httpd.service

#### Set up temportary connection parameters. Replace *ADMIN_TOKEN* with your own:

	# export OS_TOKEN=*ADMIN_TOKEN*
	# export OS_URL=http://controller:35357/v3
	# export OS_IDENTITY_API_VERSION=3

#### Create domain, project, user and role

```
	$ openstack --os-interface public project create --domain default --description "test Project" test
	+-------------+----------------------------------+
	| Field       | Value                            |
	+-------------+----------------------------------+
	| description | test Project                     |
	| domain_id   | bea2ef5b95c54584947a43ab53f1e3ba |
	| enabled     | True                             |
	| id          | 2e6190a72bec48b4b35ba7100e7dee76 |
	| is_domain   | False                            |
	| name        | test                             |
	| parent_id   | bea2ef5b95c54584947a43ab53f1e3ba |
	+-------------+----------------------------------+

	$ openstack --os-interface public user create --domain default test --password test --project test
	+---------------------+----------------------------------+
	| Field               | Value                            |
	+---------------------+----------------------------------+
	| default_project_id  | 2e6190a72bec48b4b35ba7100e7dee76 |
	| domain_id           | bea2ef5b95c54584947a43ab53f1e3ba |
	| enabled             | True                             |
	| id                  | b14f0bf070ee4bd6a109b059599434af |
	| name                | test                             |
	| options             | {}                               |
	| password_expires_at | None                             |
	+---------------------+----------------------------------+

	$ openstack role create --domain default owner
	+-----------+----------------------------------+
	| Field     | Value                            |
	+-----------+----------------------------------+
	| domain_id | bea2ef5b95c54584947a43ab53f1e3ba |
	| id        | 5f7d333fbe5c4b1299c0987ca5060def |
	| name      | owner                            |
	+-----------+----------------------------------+

	$ openstack --os-interface public role add --user test --project test owner
	$ openstack --os-interface public project show test > project
	$ openstack --os-interface public user show test > user
```

#### Running Sanity Checks from command line

Edite o arquivo etc/settings.json. Por exemplo:

	{
	    "environment": "fiware-lab",
	    "credentials": {
	        "keystone_url": "http://cloud.lab.fiware.org:4731/v3/",
	        "user_id": "",
	        "tenant_id": "test",
	        "tenant_name": "test",
	        "user_domain_name": "default",
	        "project_domain_name": "default",
	        "username": "test",
	        "password": "test"
	    },
	    "test_configuration": {
	        "phonehome_endpoint": "",
	        "glance_configuration": {
	            "required_images": [
	                "base_centos_6",
	                "base_centos_7",
	                "base_debian_7",
	                "base_ubuntu_12.04",
	                "base_ubuntu_14.04"
	            ]
	        },
	        "swift_configuration": {
	            "big_file_url_1": "https://github.com/telefonicaid/fiware-paas/archive/1.1.0.zip",
	            "big_file_url_2": "https://github.com/telefonicaid/fiware-paas/archive/1.3.4.zip"
	        },
	        "openstack_metadata_service_url": "http://169.254.169.254/openstack/latest/meta_data.json"
	    },
	    "key_test_cases": [
	        "test_(.*)"
	    ],
	    "opt_test_cases": [
	        "test_.*container.*"
	    ],
	    "region_configuration": {
	        "RegionOne": {
	            "external_network_name": "ext-net",
	            "shared_network_name": "shared-net",
	            "test_object_storage": false
	        },
	        "Spain2": {
	            "external_network_name": "public-ext-net-01",
	            "shared_network_name": "node-int-net-01",
	            "test_object_storage": true,
	            "test_login_name": "centos"
	        },
	        "Trento2": {
	            "external_network_name": "public-ext-net-01",
	            "shared_network_name": "node-int-net-01",
	            "test_object_storage": true
	        },
	        "Lannion2": {
	            "external_network_name": "public-ext-net-01",
	            "shared_network_name": "node-int-net-01",
	            "test_object_storage": true,
	            "test_image": "CentOS-6.3init_deprecated"
	        },
	        "Poznan": {
	            "external_network_name": "public-ext-net-01",
	            "shared_network_name": "node-int-net-01"
	        },
	        "Prague": {
	            "external_network_name": "default",
	            "test_flavor": "tiny"
	        }
	    }
	}


Rode ```./sanity_checks```. Esse comando vai executar o Sanity Checks.

Sobre os argumentos na tag ```region_configuration```, leia o comentário da [issue no stackoverflow](http://stackoverflow.com/questions/42446860/fiware-health-region-configuration/42481202#42481202).


#### Results of Sanity Check executions

Os resultados da execuçao dos testes estarao no arquivo ```test_results.xml```. 


[Referências]
http://openstack-xenserver.readthedocs.io/en/latest/04-install-identity-keystone-on-controller.html

https://github.com/telefonicaid/fiware-health/blob/develop/fiware-region-sanity-tests/docker/start.sh

