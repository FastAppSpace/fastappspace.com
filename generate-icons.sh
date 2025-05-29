#!/bin/bash

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo "ImageMagick is not installed. Please install it first."
    echo "On macOS: brew install imagemagick"
    echo "On Ubuntu: sudo apt-get install imagemagick"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p assets/icons

# Generate favicon.ico (16x16, 32x32)
magick assets/icons/rocket.svg -background none -resize 16x16 -define icon:auto-resize=16,32 assets/icons/favicon.ico

# Generate PNG versions
magick assets/icons/rocket.svg -background none -resize 16x16 assets/icons/favicon-16x16.png
magick assets/icons/rocket.svg -background none -resize 32x32 assets/icons/favicon-32x32.png
magick assets/icons/rocket.svg -background none -resize 180x180 assets/icons/apple-touch-icon.png

# Generate Android Chrome icons
magick assets/icons/rocket.svg -background none -resize 192x192 assets/icons/android-chrome-192x192.png
magick assets/icons/rocket.svg -background none -resize 512x512 assets/icons/android-chrome-512x512.png

echo "Icons generated successfully!" 