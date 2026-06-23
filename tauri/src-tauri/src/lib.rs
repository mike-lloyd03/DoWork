#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Export the workout JSON to a user-chosen location.
///
/// On Android the save dialog returns a Storage Access Framework `content://`
/// URI that `tauri-plugin-fs` can create but not reliably write bytes into
/// (the file ends up 0 bytes). `tauri-plugin-android-fs` writes through the
/// SAF document provider, which actually persists the contents.
///
/// Returns `true` if a file was written, `false` if the user cancelled.
#[cfg(target_os = "android")]
#[tauri::command]
async fn export_workouts(
    app: tauri::AppHandle,
    file_name: String,
    json: String,
) -> Result<bool, String> {
    use std::io::Write;
    use tauri_plugin_android_fs::AndroidFsExt;

    let api = app.android_fs_async();

    let selected = api
        .file_picker()
        .save_file(
            None,                      // initial location (default)
            &file_name,                // initial file name
            Some("application/json"),  // MIME type
            false,                     // allow any storage location
        )
        .await
        .map_err(|e| e.to_string())?;

    let Some(uri) = selected else {
        return Ok(false); // user cancelled the dialog
    };

    let mut file = api
        .open_file_writable(&uri)
        .await
        .map_err(|e| e.to_string())?;
    file.write_all(json.as_bytes()).map_err(|e| e.to_string())?;
    file.flush().map_err(|e| e.to_string())?;

    Ok(true)
}

#[cfg(not(target_os = "android"))]
#[tauri::command]
async fn export_workouts(
    _app: tauri::AppHandle,
    _file_name: String,
    _json: String,
) -> Result<bool, String> {
    Err("Export is only supported on Android".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init());

    #[cfg(target_os = "android")]
    {
        builder = builder.plugin(tauri_plugin_android_fs::init());
    }

    builder
        .invoke_handler(tauri::generate_handler![greet, export_workouts])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
