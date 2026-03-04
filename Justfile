avd_name := "Pixel_8"
ios_simulator_device := "iPhone 16"

build platform:
    if [ {{platform}} = "android" ]; then \
        pnpm tauri android build --aab; \
    elif [ {{platform}} == "ios" ]; then \
        pnpm tauri ios build --export-method app-store-connect; \
    fi

build-apk:
    pnpm tauri android build --apk

install:
    #!/bin/bash
    TRANSPORT_ID=$(adb devices -l | grep 192.168 | sed -n 's/.*transport_id:\([0-9]\+\).*/\1/p')
    adb -t $TRANSPORT_ID install -r src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk

dev platform:
    if [ {{platform}} = "android" ]; then \
        pnpm tauri android dev; \
    elif [ {{platform}} == "ios" ]; then \
        pnpm tauri ios dev; \
    fi

start-android-emulator:
    $ANDROID_HOME/emulator/emulator -avd {{avd_name}}

logcat:
    # adb logcat Tauri/Console:V '*:S' duck_decoy_mobile_lib:V RustStdoutStderr:V
    adb logcat | grep -Ei --color=always "duck_decoy_mobile_lib|RustStdoutStderr|Tauri/Console|webview:.*tauri"

upload:
    xcrun altool --upload-app --type ios --file 'src-tauri/gen/apple/build/arm64/*.ipa' --apiKey $API_KEY --apiIssuer $API_ISSUER

[macos]
rev:
    #!/bin/bash
    set -e
    OLD_VERSION=$(cat src-tauri/tauri.conf.json | jq  -r '.version')
    NEW_VERSION=$(semver -i $OLD_VERSION)

    sed -i "" "1,/version =/s|version = \"[^\"]*\"|version = \"$NEW_VERSION\"|" src-tauri/Cargo.toml

    dasel -i json --root "version = \"$NEW_VERSION\"" < package.json > tmp
    mv tmp package.json

    dasel -i json --root "version = \"$NEW_VERSION\"" < src-tauri/tauri.conf.json > tmp
    mv tmp src-tauri/tauri.conf.json

[linux]
rev:
    #!/bin/bash
    set -e
    OLD_VERSION=$(cat src-tauri/tauri.conf.json | jq  -r '.version')
    NEW_VERSION=$(semver -i $OLD_VERSION)

    sed -i "1,/version =/s|version = \"[^\"]*\"|version = \"$NEW_VERSION\"|" src-tauri/Cargo.toml

    dasel -i json --root "version = \"$NEW_VERSION\"" < package.json > tmp
    mv tmp package.json

    dasel -i json --root "version = \"$NEW_VERSION\"" < src-tauri/tauri.conf.json > tmp
    mv tmp src-tauri/tauri.conf.json
