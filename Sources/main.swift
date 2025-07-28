// The Swift Programming Language
// https://docs.swift.org/swift-book

import SwiftCrossUI
import DefaultBackend

@main
struct livre: App {
    @State var count = 0

    var body: some Scene {
        WindowGroup("livre") {
            VStack{
                Text("is this working?")
                .font(.headline)
            }
            HStack {
                Button("-") { count -= 1 }
                Text("Count: \(count)")
                Button("+") { count += 1 }
            }.padding()
        }
    }
}