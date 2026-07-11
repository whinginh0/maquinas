const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Configurações e credenciais (com variáveis de ambiente e fallback para o projeto maquinas)
const PORT = process.env.PORT || 80;
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dysjpxmzheyqhdiukpgu.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5c2pweG16aGV5cWhkaXVrcGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzEyMDQsImV4cCI6MjA5OTMwNzIwNH0.6wKe7_Px-xm5oiv6RhkbGtFJEOIf5VRXydwUj7vIlpU';
const BREVO_API_KEY = process.env.BREVO_API_KEY || ''; // Deve ser configurada no painel do EasyPanel
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'contato@reparoilustrado.hyzencompra.shop';
const SENDER_NAME = process.env.SENDER_NAME || 'Reparo Ilustrado';

// Inicializa cliente do Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ==========================================================================
   FUNÇÃO AUXILIAR: ENVIO DE E-MAIL VIA BREVO
   ========================================================================== */
async function sendWelcomeEmail(name, email, plan) {
    if (!BREVO_API_KEY) {
        console.warn('⚠️ BREVO_API_KEY não configurada. E-mail de boas-vindas ignorado.');
        return { success: false, error: 'BREVO_API_KEY not configured' };
    }

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu Acesso ao Material Ilustrado</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f0f6ff;
      color: #032B69;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border: 1px solid #d4e9fc;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(3, 43, 105, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #032B69 0%, #0559A5 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 30px 25px;
      line-height: 1.6;
    }
    .welcome-text {
      font-size: 18px;
      font-weight: 600;
      margin-top: 0;
    }
    .access-info {
      background-color: #e3effa;
      border-left: 4px solid #0559A5;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .access-info p {
      margin: 5px 0;
      font-size: 15px;
    }
    .btn-container {
      text-align: center;
      margin: 30px 0;
    }
    .btn {
      background: #0559A5;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 16px;
      display: inline-block;
      box-shadow: 0 4px 10px rgba(5, 89, 165, 0.25);
    }
    .btn:hover {
      background: #032B69;
    }
    .important-notice {
      background-color: #fff9db;
      border-left: 4px solid #f59f00;
      color: #664d03;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
    }
    .footer {
      background-color: #fafafa;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #777;
      border-top: 1px solid #eeeeee;
    }
    .link-backup {
      font-size: 12px;
      word-break: break-all;
      color: #0559A5;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reparo Ilustrado</h1>
    </div>
    <div class="content">
      <p class="welcome-text">Olá, ${name}! 🎉</p>
      <p>Parabéns pela sua compra! O seu acesso ao material <strong>+150 Reparos e Diagnósticos Ilustrados em Máquinas de Lavar e Tanquinhos</strong> foi liberado com sucesso.</p>
      
      <p>Abaixo estão os seus dados para acessar a Área de Membros:</p>
      
      <div class="access-info">
        <p><strong>E-mail de acesso:</strong> ${email}</p>
        <p><strong>Plano adquirido:</strong> ${plan}</p>
      </div>

      <div class="important-notice">
        <strong>⚠️ INFORMAÇÃO IMPORTANTE:</strong><br>
        O login na plataforma é feito <strong>exclusivamente por meio do e-mail de compra cadastrado acima</strong>. A nossa área de membros não utiliza senha de acesso convencional. Basta digitar o seu e-mail para entrar!
      </div>

      <div class="btn-container">
        <a href="https://www.reparoilustrado.hyzencompra.shop/area-de-membros" class="btn" target="_blank">Acessar Área de Membros</a>
        <div class="link-backup">
          Se o botão não funcionar, acesse pelo link:<br>
          <a href="https://www.reparoilustrado.hyzencompra.shop/area-de-membros" target="_blank">https://www.reparoilustrado.hyzencompra.shop/area-de-membros</a>
        </div>
      </div>

      <hr style="border: 0; border-top: 1px solid #e3effa; margin: 30px 0;">

      <p style="margin-bottom: 5px;"><strong>Precisa de Ajuda?</strong></p>
      <p style="margin-top: 0;">Nosso suporte é 100% realizado via Instagram. Caso tenha qualquer dúvida ou precise de auxílio, envie um direct para:</p>
      <p style="text-align: center; font-size: 18px; font-weight: 700;">
        <a href="https://instagram.com/reparoilustrado" target="_blank" style="color: #0559A5; text-decoration: none;">@reparoilustrado</a>
      </p>
    </div>
    <div class="footer">
      <p>Este e-mail foi enviado automaticamente. Por favor, não responda a esta mensagem.</p>
      <p>&copy; 2026 Reparo Ilustrado. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>`;

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: SENDER_NAME,
                    email: SENDER_EMAIL
                },
                to: [
                    {
                        email: email,
                        name: name
                    }
                ],
                subject: 'Seu acesso ao Material +150 Reparos e Diagnósticos Ilustrados',
                htmlContent: htmlContent
            })
        });

        const data = await response.json();
        if (response.ok) {
            console.log(`✉️ E-mail enviado com sucesso para ${email}. ID: ${data.messageId}`);
            return { success: true, messageId: data.messageId };
        } else {
            console.error('❌ Erro de resposta da Brevo:', data);
            return { success: false, error: data };
        }
    } catch (err) {
        console.error('❌ Erro na requisição para a Brevo:', err);
        return { success: false, error: err.message };
    }
}

/* ==========================================================================
   ROTA: WEBHOOK GG CHECKOUT
   ========================================================================== */
app.post('/api/webhook-gg', async (req, res) => {
    console.log('📥 Recebido Webhook GG Checkout:', JSON.stringify(req.body));
    
    // 1. Salva log inicial
    let logId = null;
    try {
        const { data, error } = await supabase
            .from('webhook_logs')
            .insert({
                payload: req.body,
                source: 'ggcheckout',
                status: 'processing'
            })
            .select('id')
            .single();
            
        if (!error && data) {
            logId = data.id;
        }
    } catch (err) {
        console.error('Erro ao salvar log no Supabase:', err);
    }

    try {
        const payload = req.body;
        const customer = payload.customer || {};
        const payment = payload.payment || {};
        
        const email = (customer.email || '').trim().toLowerCase();
        const name = (customer.name || 'Cliente').trim();
        const isManualPanel = !!payload.is_manual_panel;
        const onlyUpdateDb = !!payload.only_update_db;

        if (!email) {
            throw new Error('E-mail do cliente não fornecido no payload.');
        }

        // 2. Determina o plano (Básico ou Completo)
        // Se o título contiver "completo" ou o valor total for maior que R$ 15, considera Plano Completo
        const mainTitle = payload.product?.title || '';
        const paymentAmount = payment.amount || payment.price || 0;
        
        let plan = 'Básico';
        if (
            mainTitle.toLowerCase().includes('completo') || 
            paymentAmount > 15
        ) {
            plan = 'Completo';
        }

        // 3. Processa orderbumps (se existirem)
        const orderbumps = [];
        const products = payload.products || [];
        products.forEach(p => {
            if (p.type === 'orderbump' || (p.title && p.title !== mainTitle)) {
                orderbumps.push(p.title);
            }
        });

        // 4. Cria ou atualiza membro no Supabase
        const memberData = {
            name: name,
            email: email,
            plan: plan,
            orderbumps: orderbumps
        };

        const { error: upsertError } = await supabase
            .from('members')
            .upsert(memberData, { onConflict: 'email' });

        if (upsertError) {
            throw upsertError;
        }

        console.log(`✅ Membro ${email} cadastrado/atualizado no Supabase. Plano: ${plan}`);

        // 5. Envia o e-mail se não for solicitado apenas atualizar o banco
        let emailResult = { success: false, skipped: true };
        if (!onlyUpdateDb) {
            emailResult = await sendWelcomeEmail(name, email, plan);
        }

        // 6. Atualiza log para sucesso
        if (logId) {
            await supabase
                .from('webhook_logs')
                .update({
                    status: 'success',
                    payload: {
                        ...payload,
                        _processed_data: {
                            email,
                            name,
                            plan,
                            orderbumps,
                            email_sent: !onlyUpdateDb,
                            email_result: emailResult
                        }
                    }
                })
                .eq('id', logId);
        }

        return res.status(200).json({
            success: true,
            message: 'Webhook processado com sucesso',
            member: memberData,
            email_result: emailResult
        });

    } catch (err) {
        console.error('❌ Erro ao processar webhook:', err);
        
        // Atualiza log para erro
        if (logId) {
            await supabase
                .from('webhook_logs')
                .update({
                    status: 'error',
                    payload: {
                        ...req.body,
                        _error: err.message
                    }
                })
                .eq('id', logId);
        }

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

/* ==========================================================================
   ROTA: LOGS DE WEBHOOKS (OPCIONAL/SUPORTE)
   ========================================================================== */
app.post('/api/webhook-brevo', async (req, res) => {
    // Apenas registra logs caso precise debugar eventos de entrega de e-mail da Brevo
    try {
        await supabase
            .from('webhook_logs')
            .insert({
                payload: req.body,
                source: 'brevo',
                status: 'received'
            });
    } catch (err) {
        console.error('Erro ao salvar log da Brevo:', err);
    }
    return res.status(200).json({ success: true });
});

/* ==========================================================================
   SERVE ARQUIVOS ESTÁTICOS
   ========================================================================== */
// Servir área de membros em /area-de-membros
app.use('/area-de-membros', express.static(path.join(__dirname, 'area-de-membros')));

// Servir página de vendas na raiz /
app.use('/', express.static(path.join(__dirname, 'pagina-de-vendas')));



// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor unificado rodando na porta ${PORT}`);
    console.log(`🔗 Área de Membros disponível em http://localhost:${PORT}/area-de-membros`);
    console.log(`🔗 Página de Vendas disponível em http://localhost:${PORT}`);
});
