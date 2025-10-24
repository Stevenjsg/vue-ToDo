import { ref, computed, type Ref } from 'vue'
import type { Item } from '@/data/DataTypes'

// Recibe la lista reactiva de items como argumento
export function useItemFilters(items: Ref<Item[]>) {
  const activeTag = ref<string | null>(null)
  const completionFilter = ref<'all' | 'completed' | 'pending'>('all')

  const setCompletionFilter = (filter: 'all' | 'completed' | 'pending') => {
    completionFilter.value = filter
  }

  const handleTagClick = (tag: string) => {
    activeTag.value = activeTag.value === tag ? null : tag
  }

  // La propiedad computada que hace el filtrado
  const filteredItems = computed(() => {
    let itemsFiltrados = items.value
    console.log(`COMPUTED: items.value tiene longitud ${itemsFiltrados.length}`) // <-- LOG 3
    // Filtro por estado
    if (completionFilter.value === 'completed') {
      itemsFiltrados = itemsFiltrados.filter((item) => item.completada)
    } else if (completionFilter.value === 'pending') {
      itemsFiltrados = itemsFiltrados.filter((item) => !item.completada)
    }

    // Filtro por tag
    if (activeTag.value) {
      itemsFiltrados = itemsFiltrados.filter((item) =>
        item.etiquetas.includes(activeTag.value as string),
      )
    }

    // Podrías añadir ordenación aquí si quieres
    // itemsFiltrados.sort(...)
    console.log('COMPUTED: filteredItems longitud final:', itemsFiltrados.length) // <-- LOG 4
    return itemsFiltrados
  })

  // Devuelve el estado de los filtros, las funciones para cambiarlos y la lista filtrada
  return {
    activeTag,
    completionFilter,
    setCompletionFilter,
    handleTagClick,
    filteredItems,
  }
}
