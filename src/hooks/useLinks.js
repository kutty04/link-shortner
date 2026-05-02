import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { generateShortCode } from '../lib/utils'
import { useAuth } from './useAuth'

export function useLinks() {
  const { user } = useAuth()
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLinks = useCallback(async () => {
    if (!user) { setLinks([]); setLoading(false); return }
    setLoading(true)
    const { data } = await supabase
      .from('links')
      .select('*, clicks(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setLinks(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchLinks() }, [fetchLinks])

  const createLink = async ({ originalUrl, customAlias, title, expiresAt, password }) => {
    const short_code = customAlias || generateShortCode()

    // Check duplicate alias
    if (customAlias) {
      const { data: existing } = await supabase
        .from('links')
        .select('id')
        .eq('short_code', customAlias)
        .maybeSingle()
      if (existing) throw new Error('That alias is already taken')
    }

    let password_hash = null
    if (password) {
      // simple base64 "hash" for demo — in prod use bcrypt via edge function
      password_hash = btoa(password)
    }

    const { data, error } = await supabase.from('links').insert({
      user_id: user?.id || null,
      original_url: originalUrl,
      short_code,
      custom_alias: customAlias || null,
      title: title || null,
      expires_at: expiresAt || null,
      password_hash,
    }).select().single()

    if (error) throw error
    await fetchLinks()
    return data
  }

  const deleteLink = async (id) => {
    await supabase.from('links').delete().eq('id', id)
    await fetchLinks()
  }

  const toggleLink = async (id, is_active) => {
    await supabase.from('links').update({ is_active: !is_active }).eq('id', id)
    await fetchLinks()
  }

  return { links, loading, createLink, deleteLink, toggleLink, refetch: fetchLinks }
}
