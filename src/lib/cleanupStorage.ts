import { supabase } from './supabase';

export async function cleanupTempImages(folder: string) {
  try {
    // Listar arquivos
    const { data: files, error } = await supabase.storage
      .from('wedding-photos')
      .list(folder);

    if (error) throw error;

    // Remover arquivos
    if (files && files.length > 0) {
      const filesToRemove = files.map((file) => `${folder}/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from('wedding-photos')
        .remove(filesToRemove);

      if (deleteError) throw deleteError;
    }
  } catch (error) {
    console.error('Erro ao limpar imagens:', error);
    throw error;
  }
}
