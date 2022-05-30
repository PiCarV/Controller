#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{window::WindowBuilder, WindowUrl};

fn main() {
  //check if we are in debug or release mode
  if cfg!(debug_assertions) {
    println!("Debug mode");
    tauri::Builder::default()
      .setup(move |app| {
        WindowBuilder::new(
          app,
          "main".to_string(),
          WindowUrl::External(format!("http://localhost:8080").parse().unwrap()),
        )
        .title("PiCar Controller")
        .build()?;
        Ok(())
      })
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
  } else {
    println!("Release mode");
    let port = portpicker::pick_unused_port().expect("failed to find unused port");
    tauri::Builder::default()
      .plugin(tauri_plugin_localhost::Builder::new(port).build())
      .setup(move |app| {
        WindowBuilder::new(
          app,
          "main".to_string(),
          WindowUrl::External(format!("http://localhost:{}", port).parse().unwrap()),
        )
        .title("PiCar Controller")
        .build()?;
        Ok(())
      })
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
  }
}
