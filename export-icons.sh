#!/bin/bash
script_location="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
android=false
ios=false

function show_help {
cat <<-END
    Exports an icon in SVG format to PNG icons in <SCRIPT_LOCATION>/cordova/resources for
    Android and iOS.

    Usage: ./export-icons.sh [SOURCE...]
    SOURCE must be an absolute path.

    Example: ./export-icons.sh ~/git/project/svg/logo.svg

    Available options:

    no options        Export Android and iOS variants of the image.
    -a, --android     Export Android variants of the image.
    -i, --ios         Export iOS variants of the image.
    -d, --dry         Dry run. Only output expected results in the console without writing any files.
    -h, --help        Show this help.
END
}

while test $# -gt 0
do
    case "$1" in
        -a|--android) android=true
            ;;
        -i|--ios) ios=true
            ;;
        -d|--dry) dry_run=true
            ;;
        -h|--help) show_help; exit 0
            ;;
        --*) echo "Bad option $1"; exit 1
            ;;
        *) svg=$1
            ;;
    esac
    shift
done

function command_exists {
    type "$1" &> /dev/null ;
}

function export_svg {
  size=$1
  png=$script_location/cordova/resources/$2
  echo -e "Exporting \033[1;34m$svg\033[0m -> [w: ${size%.*}, h: ${size%.*}] \033[1;34m$png\033[0m"
  if [[ $dry_run != true ]]; then
      mkdir -p "$(dirname "$png")"
      inkscape -z -e $png -h $size -w $size $svg
  fi
}

if ! command_exists inkscape; then
    echo "Inkscape binary must be in PATH.";
    exit 1;
fi

if [ -z "$svg" ]; then
    echo "Source path not specified. See ./export.sh -h for usage.";
    exit 1;
fi

if [[ ! -f $svg ]]; then
    echo "Expected file, but source is not a file."
    exit 1;
fi

if [[ "$dry_run" == true ]]; then
    echo -e "\033[1;33mDry run.\033[0m\n"
fi

if [[ "$android" == true || "$ios" == false ]]; then
    export_svg 48 android/drawable-mdpi/ic_launcher.png
    export_svg 72 android/drawable-hdpi/ic_launcher.png
    export_svg 96 android/drawable-xhdpi/ic_launcher.png
    export_svg 144 android/drawable-xxhdpi/ic_launcher.png
    export_svg 192 android/drawable-xxxhdpi/ic_launcher.png
fi

if [[ "$ios" == true || "$android" == false ]]; then
    export_svg 20 ios/icons/icon-20.png
    export_svg 48 ios/icons/icon-24@2x.png
    export_svg 55 ios/icons/icon-27.5@2x.png
    export_svg 88 ios/icons/icon-44@2x.png
    export_svg 167 ios/icons/icon-83.5@2x.png
    export_svg 172 ios/icons/icon-86@2x.png
    export_svg 196 ios/icons/icon-98@2x.png
    export_svg 1024 ios/icons/icon-1024.png
    export_svg 40 ios/icons/icon-40.png
    export_svg 80 ios/icons/icon-40@2x.png
    export_svg 50 ios/icons/icon-50.png
    export_svg 100 ios/icons/icon-50@2x.png
    export_svg 60 ios/icons/icon-60.png
    export_svg 120 ios/icons/icon-60@2x.png
    export_svg 180 ios/icons/icon-60@3x.png
    export_svg 72 ios/icons/icon-72.png
    export_svg 144 ios/icons/icon-72@2x.png
    export_svg 76 ios/icons/icon-76.png
    export_svg 152 ios/icons/icon-76@2x.png
    export_svg 29 ios/icons/icon-small.png
    export_svg 58 ios/icons/icon-small@2x.png
    export_svg 87 ios/icons/icon-small@3x.png
    export_svg 57 ios/icons/icon.png
    export_svg 114 ios/icons/icon@2x.png
fi
