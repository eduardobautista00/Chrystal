#!/bin/bash
echo "Running post-install script to cache Gradle dependencies"
cd android && ./gradlew dependencies
