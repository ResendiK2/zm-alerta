'use client';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content help-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>💡 Como Funciona</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Fechar">
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <section className="help-section">
                        <h3>📍 Visualizando Alertas</h3>
                        <p>
                            O mapa mostra alertas em tempo real de toda a Zona da Mata.
                            Cada marcador colorido representa um tipo diferente de alerta.
                            Use a legenda no canto inferior esquerdo para identificar cada tipo.
                        </p>
                    </section>

                    <section className="help-section">
                        <h3>🗺️ Navegando no Mapa</h3>
                        <ul>
                            <li>Use <strong>dois dedos</strong> para arrastar e mover o mapa</li>
                            <li>Use <strong>pinça</strong> (pinch) para dar zoom in/out</li>
                            <li>Toque em um <strong>marcador</strong> para ver detalhes do alerta</li>
                            <li>Use o botão <strong>🎯</strong> para centralizar na sua localização</li>
                        </ul>
                    </section>

                    <section className="help-section">
                        <h3>📢 Reportando um Alerta</h3>
                        <p>Ajude a comunidade reportando situações de risco:</p>
                        <ol>
                            <li>Toque no botão <strong>azul (+)</strong> no canto inferior direito</li>
                            <li>Selecione o <strong>tipo de alerta</strong> que deseja reportar</li>
                            <li>Marque a <strong>localização exata</strong> tocando no mapa</li>
                            <li>Adicione uma <strong>descrição clara</strong> do problema</li>
                            <li>Confirme o envio</li>
                        </ol>
                        <p className="help-note">
                            ⚠️ Reporte apenas situações reais. Informações falsas podem
                            prejudicar a comunidade.
                        </p>
                    </section>

                    <section className="help-section">
                        <h3>🔔 Gerenciando Alertas</h3>
                        <p>
                            Na aba <strong>&quot;Alertas&quot;</strong> (👁️) você pode visualizar todos
                            os alertas em formato de lista com detalhes completos.
                        </p>
                    </section>

                    <section className="help-section">
                        <h3>🌐 Sobre o Projeto</h3>
                        <p>
                            O <strong>Zona da Mata Alertas</strong> é uma plataforma colaborativa
                            que permite que moradores da região compartilhem informações sobre
                            situações de risco em tempo real, contribuindo para a segurança
                            e bem-estar de toda a comunidade.
                        </p>
                    </section>

                    <section className="help-section">
                        <h3>💬 Precisa de Mais Ajuda?</h3>
                        <p>
                            Em caso de emergência real, sempre contate os serviços oficiais:
                        </p>
                        <ul className="emergency-contacts">
                            <li>🚨 <strong>Bombeiros:</strong> 193</li>
                            <li>🚓 <strong>Polícia:</strong> 190</li>
                            <li>🏥 <strong>SAMU:</strong> 192</li>
                            <li>⚠️ <strong>Defesa Civil:</strong> 199</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
