# triangle-projection-conversion

## Purpose

This website allows for projecting 3d mesh into 2d surface from arbitrary angle. Then resulting image can be saved as SVG/PDF, scaling original dimensions.

### Backstory

I needed to have a stencil for cutting polarizer foil for OpenScan, in a shape matching an element. Since I couldn't easily export it as a surface to a sheet of paper, I decided to create an app just for this purpose.

## Structure

### ui

Website in Typescript/React, notable libraries are THREE.js and ChakraUI. Served at [3d-projection-lab.com](https://3d-projection-lab.com).

Run with `npm run dev`.

### feedback-lambda

Lightweight backend in AWS Lambda, used for gathering votes for next features/improvements. Each submission consists of a single option and is defended against spam with a simple honeypot field.

Run with `npm run dev`.

### terraform

Files to deploy the project with Terraform.