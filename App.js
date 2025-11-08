import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from 'react-native'
import './global.css'

const App = () => {

  // Nuestros Datos
  const [tareas, setTareas] = useState([
    {id: 1, texto: 'Learn React', completada: false},
    {id: 2, texto: 'Learn Tailwind', completada: true},
  ])

  const [nuevaTarea, setNuevaTarea] = useState('')

  //Agregar nueva tarea
  const agregarTarea = () => {
    if (nuevaTarea.trim() === '') return

    const tarea = {
      id: Date.now(),
      texto: nuevaTarea,
      completada: false
    }

    // animate layout change (add)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setTareas([...tareas, tarea])
    setNuevaTarea('')
  }

  //Toggle completada
  const toogleTarea = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setTareas(tareas.map(tarea =>
      tarea.id === id ? {...tarea, completada:!tarea.completada} : tarea
    ))
  }

  //Eliminar
  const eliminarTarea = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setTareas(tareas.filter(tarea => tarea.id !== id))
  }

  // Limpiar completadas (small tweak)
  const limpiarCompletadas = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setTareas(tareas.filter(t => !t.completada))
  }

  // Mark all as complete (extra UI feature)
  const markAllComplete = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setTareas(tareas.map(t => ({...t, completada: true})))
  }

  const tareasCompletadas = tareas.filter(item => item.completada).length
  const totalTareas = tareas.length

  // header fade-in animation value and platform setup
  const headerOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <View className='flex-1 bg-teal-50 p-6 pt-16'>
      {/* Header */}
      <Animated.View style={{opacity: headerOpacity}} className='mb-4'>
        <Text className='text-4xl font-bold text-gray-800 mb-2'>
          My Tasks
        </Text>
        <Text className='text-lg text-gray-600'>
          {tareasCompletadas} of {totalTareas} completed
        </Text>

        {/* Controls: Clear completed + Mark all complete + Info */}
        <View className='flex-row mt-3'>
          <TouchableOpacity
            onPress={limpiarCompletadas}
            className='bg-teal-200 px-4 py-2 rounded-lg mr-3'
          >
            <Text className='text-teal-800 font-medium'>Clear completed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={markAllComplete}
            className='bg-teal-300 px-4 py-2 rounded-lg mr-3'
          >
            <Text className='text-teal-900 font-medium'>Mark all complete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => alert('Small tweak: cloned app with English text and animations')}
            className='bg-white px-4 py-2 rounded-lg border border-teal-200'
          >
            <Text className='text-teal-700'>Info</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* New Task Input */}
      <View className='flex-row gap-3 mb-6'>
        <TextInput 
          className='flex-1 bg-white px-4 py-3 rounded-xl border-2 border-teal-100 text-gray-800 mr-3' 
          placeholder="Write a new task"
          value={nuevaTarea}
          onChangeText={setNuevaTarea}
        />
        <TouchableOpacity
          onPress={agregarTarea}
          className="bg-teal-500 px-6 py-3 rounded-xl active:bg-teal-600"
        >
          <Text className="text-white font-semibold text-2xl">+</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Tareas */}
      <ScrollView className="flex-1">
        {tareas.map((tarea)=>(
          <View
            key={tarea.id}
            className={`bg-white p-4 rounded-xl mb-3 border-2 ${tarea.completada ? 'border-green-300 bg-green-50':'border-gray-200'}`}
          >
            <View className='flex-row items-center justify-between'>
              <TouchableOpacity
                onPress={()=> toogleTarea(tarea.id)}
                className='flex-1 flex-row items-center gap-3'
              >
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    tarea.completada
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-400'
                  }`}
                >
                  {tarea.completada && (
                    <Text className="text-white text-sm font-bold"></Text>
                  )}
                </View>
                <Text
                  className={`flex-1 text-lg ${
                    tarea.completada
                      ? 'text-gray-500 line-through'
                      : 'text-gray-800'
                  }`}
                >
                  {tarea.texto}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={()=>eliminarTarea(tarea.id)}
                className='bg-red-100 px-3 py-2 rounded-lg active:border-red-200'
              >
                <Text className='text-lg'>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {tareas.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-gray-400 text-xl">
              No tasks yet — create one
            </Text>
          </View>
        )}

      </ScrollView>

      {/* Footer */}
      <View className='py-4 items-center'>
        <Text className='text-sm text-gray-400'>Practice app — Tailwind + NativeWind</Text>
      </View>
    </View>
  )

}

export default App
