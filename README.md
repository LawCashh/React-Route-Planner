# React Route Planner Project

## Author: Caslav Bakic

React application that allows users to plan a route with multiple stops using the Google Maps API.

<img src="https://cdn.discordapp.com/attachments/934963592405598252/1164680722557182053/rrp1.png?ex=65441872&is=6531a372&hm=b6c9195ec56600d962a7cce229735f28838c1b28e053530d591a48526b623d4f&" alt="picture alt" width="500">

## The app components:

#### 1. The Route planning form contains:

    1. Your origin (an input field)
    2. Your destination (an input field)
    3. The add stop button, used to add new "in-between" stops
    4. The show route button used to show the route on the Map

#### 2. The Map on the right

### Features:

- Typing in the input fields gives you Autocomplete suggestions

  <img src="https://media.discordapp.net/attachments/934963592405598252/1164680722854989925/rrp2.png" alt="picture alt" width="300">

- Clicking on the 'Add stop' button appends a new input field for an "in-between" stop and you can add as many of these as you want

    <img src="https://media.discordapp.net/attachments/934963592405598252/1164680723152781383/rrp3.png?ex=65441873&is=6531a373&hm=e9e2744a7878889739b8f1633010ba39c4efb2f523e0e17db0f32fc65f046b2f&=" alt="picture alt" width="300">

- The "in-between" stops have the option of removing them with the X icon on the right of the input

    <img src="https://media.discordapp.net/attachments/934963592405598252/1164680723396042792/rrp4.png?ex=65441873&is=6531a373&hm=7918e7f82cbfd013398a3497cffb49babb93a3e66f4fce35c23aa914014bc9a0&=" alt="picture alt" width="300">

- All input are validated and will show an error if a place for the particular input is not selected, at this point the Show Route button is disabled as well, because you need to have all the stops filled

    <img src="https://media.discordapp.net/attachments/934963592405598252/1164680723677073438/rrp5.png?ex=65441873&is=6531a373&hm=64f3c3846419af9dac33e5f3feda43e139967cf5f4675cd282e460f6e667f9f1&=" alt="picture alt" width="300">

- The text below the form reminds you to fill out the routes too. The map on the right will scale(zoom) appropriately based upon the selected places, so that these places will always be in the frame

    <img src="https://media.discordapp.net/attachments/934963592405598252/1164680723949699102/rrp6.png?ex=65441873&is=6531a373&hm=9146559cfec9f6027d2f77d6712f9e3100b3bf9e5508b91b93df4c30a147ee78&=&width=861&height=441" alt="picture alt" width="500">

- If you have filled out all the spots, the Show Route button becomes green (available) at which point pressing the button will show you the best appropriate route for your stop selection.

    <img src="https://media.discordapp.net/attachments/934963592405598252/1164680724587237500/rrp8.png?ex=65441873&is=6531a373&hm=b0850ecc33fc6be67b33d5394188250700720a17e75edc28ecc56af8ec8920cb&=&width=861&height=473" alt="picture alt" width="500">

- At this point you can decide to change the stops and press the Show route again which will append the new route (maybe if you want to compare routes), but the most common use case scenario would be refreshing the page to try out some other routes.

    <img src="https://media.discordapp.net/attachments/934963592405598252/1164680724876640307/rrp9.png?ex=65441873&is=6531a373&hm=7681a8ccb98864d7a02c0ceb41a5edc639da66d6c2822726e04e1e3df3c73dd0&=&width=861&height=468" alt="picture alt" width="500">

- The website is responsive and can be used on all screen sizes. Example with typical phone screen:

    <img src="https://media.discordapp.net/attachments/934963592405598252/1164685401781440522/rrp10.png?ex=65441cce&is=6531a7ce&hm=4e75d22849cd33eba2f21c3d09212f75d277b93e5d1dab3fd617913b99a4fe97&=&width=338&height=528" alt="picture alt" width="300">

### Libraries/Packages used:

**@react-google-maps/api** - includes a set of React components wrapping the underlying Google Maps JavaScript API v3 instances

**Tailwind** - for styling

**uuid** - for some unique identification
