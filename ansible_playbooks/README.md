Spark-Playbook
--------------

In this project, I intend to provide playbooks to deploy and scale a Apache Spark cluster. This would allow executing PySpark jobs on a Spark cluster. Current configuration will spawn t2.medium instances using 4 GB of general purpose disks with Ubuntu trusty image in us-east-1 region.

> Note: These playbooks will create a Spark cluster with Spark's standalone cluster manager. Please modify the playbooks accordingly to add a new cluster manager(YARN/Mesos).

This project contains two playbooks - 

1. launch-spark-cluster - For launching an entirely new Spark Cluster
2. launch-spark-slaves  - For creating a slave node and scaling the Spark Cluster

Installation
============

Please ensure the following things are installed or in place:
- [Ansible](http://docs.ansible.com/ansible/intro_installation.html)
- Install Boto module using `sudo pip install boto`
- [Boto AWS Configuration](http://docs.pythonboto.org/en/latest/boto_config_tut.html)
- Update the ansible.cfg file to point to your AWS `key_name.pem`
- Make sure to check the permissions on your AWS `key_name.pem` file (Run `sudo chmod 400 key_name.pem`)

Configuration changes
=====================
There are 5 different roles defined:
- build-instances
- bootstrap-spark-node
- hadoop-node
- add-spark-slave
- spark-node

#### build-instances ####
=========================
This role is used for provisioning EC2 instances. Please update `keyname`, `network`, `vpc_subnet_id` and `group` in the vars YAML file.

> Note: Please use Ansible dynamic inventory for provisioning EC2 instances. 
> Note: Ensure that all traffic is allowed between EC2 instances in the Spark security group. Open only required ports like 8080, 4040, 50070, etc. to public access.

#### bootstrap-spark-node ####
========================
This role installs required software and python dependencies on each of the master and slave nodes. Please provide the dependencies in a `requirements.txt` and `scientific-requirements.txt` file.

#### hadoop-node ####
========================
This role is used for installing hadoop on each of the nodes and starting the hadoop cluster/slave.

#### add-spark-slave ####
========================
This role adds the spark slave configuration to the spark master for a particular environment.

#### spark-node ####
========================
This role installs spark on each of the node and starts the spark cluster/slave.

How to run
==========
Use the following command to launch the playbook from command line:
`ansible-playbook --private-key=<private_key_file> -vvvv launch-spark-cluster.yml`
You can get rid of `-vvvv` to reduce the verbosity of the output.

Testing
=======
We can then check if the Spark cluster is running or not using the following URL:

`http://<master-node-public-ip>:8080/`
