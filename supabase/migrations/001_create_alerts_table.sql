-- Cria a tabela de alertas
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('alagamento', 'deslizamento', 'falta_energia', 'pessoa_risco', 'abrigo')),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

-- Índice para melhorar performance de queries por tipo
CREATE INDEX IF NOT EXISTS idx_alerts_type ON public.alerts(type);

-- Índice para melhorar performance de queries por data de expiração
CREATE INDEX IF NOT EXISTS idx_alerts_expires_at ON public.alerts(expires_at);

-- Índice para queries geoespaciais (opcional, para buscas por proximidade)
CREATE INDEX IF NOT EXISTS idx_alerts_location ON public.alerts(latitude, longitude);

-- Habilita Row Level Security (RLS)
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Policy para permitir leitura pública de alertas não expirados
CREATE POLICY "Permitir leitura pública de alertas ativos"
    ON public.alerts
    FOR SELECT
    USING (expires_at > NOW());

-- Policy para permitir inserção pública de alertas
CREATE POLICY "Permitir criação pública de alertas"
    ON public.alerts
    FOR INSERT
    WITH CHECK (true);

-- Policy para permitir deleção pública de alertas
CREATE POLICY "Permitir deleção pública de alertas"
    ON public.alerts
    FOR DELETE
    USING (true);

-- Função para deletar alertas expirados automaticamente
CREATE OR REPLACE FUNCTION delete_expired_alerts()
RETURNS void AS $$
BEGIN
    DELETE FROM public.alerts WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários úteis
COMMENT ON TABLE public.alerts IS 'Alertas colaborativos de emergência com expiração automática';
COMMENT ON COLUMN public.alerts.type IS 'Tipo do alerta: alagamento, deslizamento, falta_energia, pessoa_risco, abrigo';
COMMENT ON COLUMN public.alerts.expires_at IS 'Data de expiração do alerta (24h após criação)';
