# This declares a job named "docs". There can be exactly one
# job declaration per job file.
job "anisync" {
  # Specify this job should run in the region named "us". Regions
  # are defined by the Nomad servers' configuration.

  # Spread the tasks in this job between us-west-1 and us-east-1.
  datacenters = ["ap-southeast"]

  # Run this job as a "service" type. Each job type has different
  # properties. See the documentation below for more examples.
  type = "service"

  # Specify this job to have rolling updates, two-at-a-time, with
  # 30 second intervals.
  update {
    stagger      = "30s"
    max_parallel = 1
  }


  # A group defines a series of tasks that should be co-located
  # on the same client (host). All tasks within a group will be
  # placed on the same host.
  group "webs" {
    # Specify the number of these tasks we want.
    # Currently we have no way to shard connections so for now we are limited to 1 instance
    count = 1

    network {
      # This requests a dynamic port named "http". This will
      # be something like "46283", but we refer to it via the
      # label "http".
      port "http" {
        to = 80
      }
    }

    # The service block tells Nomad how to register this service
    # with Consul for service discovery and monitoring.
    service {
      # We add some tags to tell the traefik container how to route packets to this container
      # and this container should provision a ssl cert using the "myresolver" resoulver
      tags = [
        "traefik.enable=true",
        "traefik.http.routers.anisync.rule=Host(`anisync.adl.cafe`)",
        "traefik.http.routers.anisync.tls.certResolver=myresolver",
      ]
      # This tells Consul to monitor the service on the port
      # labelled "http". Since Nomad allocates high dynamic port
      # numbers, we use labels to refer to them.
      port = "http"

      check {
        type     = "http"
        path     = "/"
        interval = "10s"
        timeout  = "2s"
      }
    }

    # Create an individual task (unit of work). This particular
    # task utilizes a Docker container to front a web application.
    task "frontend" {
      # Specify the driver to be "docker". Nomad supports
      # multiple drivers.
      driver = "docker"

      # Configuration is specific to each driver.
      config {
        image = "ghcr.io/thattomperson/anisync:v0.0.2"
        ports = ["http"]
        force_pull = true
      }

      # Specify the maximum resources required to run the task,
      # include CPU and memory.
      resources {
        cpu    = 500 # MHz
        memory = 128 # MB
      }
    }
  }
}
