---
layout: post
title: ECP profile
comments: true
tags: [ecp, sp]
permalink: "ecp"
author: Gabriela Cavalcante
---

### Enhanced Client or Proxy (ECP)


An option to support Federation from no web clients is the ECP profile.
This profile is an adaptation of the SAML profile used for Browser SSO 
with the parts that were designed around the limitations of a browser removed [1](https://wiki.shibboleth.net/confluence/display/CONCEPT/ECP).
The definition of the ECP profile has a same set of participants as the browser sso profile:
  a. a **subject** controlling a client
  b. an **IdP** to authenticate the subject
  c. an **SP** that can accept an assertion from the IdP to establish a session with the subject.
  
In this flow, the protocol used is SOAP/PAOS.

So, we have an Enhanced Client Proxy (ecp), a Service Provider (sp)
and a, Identity Provider as idp. We can see the ecp flow: 

1. ecp > sp: the ecp ask for access to the resource
2. sp > sp: Check principal privileges
alt Principal not authenticated
3. sp > ecp:  return a PAOS request
4. ecp > idp: in SOAP request with basic authorization header
alt Credentials valid
5. idp->ecp: Signed success  in SOAP response
6. ecp->sp: Signed  in PAOS response
7. sp->ecp: Provide resource
8. else Credentials invalid
9. idp->ecp: Signed error  in SOAP response
10. end 

### Enable ECP profile SP Shibboleth 
Go to the shibboleth directory,```/etc/shibboleth```, and edit the file shibboleth2.xml. Add *ECP="true"* na ``<SSO>`` section, as we show:

```
<SSO discoveryProtocol="SAMLDS" ECP="true" discoveryURL=".../Shibboleth.sso/DS">
  SAML2 SAML1
</SSO>
```

### ECP Client implementation

We based on the script of [shibboleth wiki](https://wiki.shibboleth.net/confluence/download/attachments/4358416/ecp.py?api=v2).


