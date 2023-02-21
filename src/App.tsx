import { useState, useRef, MutableRefObject } from "react"
import * as THREE from "three"
import { v4 as uuidv4 } from "uuid"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, Box, Cylinder } from "@react-three/drei"

import { Shape, ShapeName } from "./types/shapeTypes"

import "./App.css"

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedShape, setSelectedShape] = useState<ShapeName>(null)
  const [shapes, setShapes] = useState<Shape[]>([])
  const [scale, setScale] = useState<number>(1)

  const positions = [] as Array<[number, number, number]>
  for (let x = -3; x <= 3; x += 2) {
    for (let y = -3; y <= 3; y += 2) {
      for (let z = -3; z <= 3; z += 2) {
        positions.push([x, y, z])
      }
    }
  }

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(Number(e.target.value))
  }

  const createShape = () => {
    if (selectedShape) {
      const id = uuidv4()
      const positionIndex = Math.floor(Math.random() * positions.length)
      const position = positions[positionIndex]
      const newShapes: Shape = {
        id,
        name: selectedShape,
        scale,
        position,
      }
      setShapes([...shapes, newShapes])
      positions.splice(positionIndex, 1)
    } else {
      alert("Please, choose geometry")
    }
  }

  const deleteShape = (id: string) => {
    const shape = shapes.find((shape) => shape.id === id)
    if (shape) {
      positions.push(shape.position)
    }
    const newShapes = shapes.filter((shape) => shape.id !== id)
    setShapes(newShapes)
  }

  return (
    <div className="app">
      <div className="controls">
        <select value={selectedShape ?? ""} onChange={(e) => setSelectedShape(e.target.value as ShapeName)}>
          <option>Choose geometry</option>
          <option value="sphere">Sphere</option>
          <option value="box">Box</option>
          <option value="cylinder">Cylinder</option>
        </select>
        <input type="text" value={scale} onChange={handleScaleChange} />
        <button onClick={createShape}>CREATE</button>
      </div>

      <div className="shapes">
        {shapes.map((shape) => (
          <div className="shape-item" key={shape.id}>
            ID: {shape.id} ({shape.name})<button onClick={() => deleteShape(shape.id)}>X</button>
          </div>
        ))}
      </div>

      <Canvas
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
        camera={{ position: [0, 2, 20], fov: 50 }}
        gl={{ antialias: true }}
        style={{ height: "100vh" }}
        ref={canvasRef}>
        <OrbitControls />
        {shapes.map((shape, index) => {
          let mesh
          switch (shape.name) {
            case "sphere":
              mesh = (
                <Sphere key={index} args={[1, 32, 32]} scale={[shape.scale, shape.scale, shape.scale]} position={shape.position}>
                  <meshStandardMaterial attach="material" color="green" />
                </Sphere>
              )
              break
            case "box":
              mesh = (
                <Box key={index} args={[1, 1, 1]} scale={[shape.scale, shape.scale, shape.scale]} position={shape.position}>
                  <meshStandardMaterial attach="material" color="red" />
                </Box>
              )
              break
            case "cylinder":
              mesh = (
                <Cylinder key={index} args={[1, 1, 2, 32]} scale={[shape.scale, shape.scale, shape.scale]} position={shape.position}>
                  <meshStandardMaterial attach="material" color="yellow" />
                </Cylinder>
              )
              break
            default:
              mesh = null
          }
          return mesh
        })}
        <directionalLight
          position={[0, 10, 0]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          castShadow
        />
        <ambientLight intensity={0.4} />
      </Canvas>
    </div>
  )
}

export default App
