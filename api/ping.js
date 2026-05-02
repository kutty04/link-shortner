import { supabase } from '../src/lib/supabase.js'

export default async function handler(req, res) {
  try {
    // Simple health check - query the database
    const { data, error } = await supabase
      .from('links')
      .select('count()', { count: 'exact' })
      .limit(1)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'alive'
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
