import { Client } from 'pg';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const API_URL = 'http://localhost:3001';

async function seed() {
    console.log('🌱 Iniciando Seed de Lavras/MG...');

    // 1. Conectar ao Banco de Dados para garantir o usuário Admin
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:5432/missas_lavras',
    });

    try {
        await client.connect();
        console.log('✅ Conectado ao PostgreSQL');

        const emailAdmin = 'admin@missahoje.com.br';
        const senhaAdmin = 'Admin123!';

        // Verifica se o usuário já existe
        const res = await client.query('SELECT id FROM usuarios WHERE email = $1', [emailAdmin]);

        if (res.rows.length === 0) {
            console.log('👤 Usuário admin não encontrado. Criando...');
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(senhaAdmin, salt);
            const userId = crypto.randomUUID();

            await client.query(
                `INSERT INTO usuarios (id, nome, email, senha, role) VALUES ($1, $2, $3, $4, $5)`,
                [userId, 'Administrador do Sistema', emailAdmin, hash, 'admin']
            );
            console.log('✅ Usuário admin criado com sucesso.');
        } else {
            console.log('✅ Usuário admin já existe.');
        }
    } catch (err) {
        console.error('❌ Erro na configuração inicial do BD:', err);
        process.exit(1);
    } finally {
        await client.end();
    }

    // 2. Fazer login na API para obter o token JWT
    console.log('\n🔑 Autenticando na API...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@missahoje.com.br', senha: 'Admin123!' }),
    });

    if (!loginRes.ok) {
        console.error('❌ Falha ao logar na API. Verifique se o servidor está rodando na porta 3000.');
        const err = await loginRes.text();
        console.error(err);
        process.exit(1);
    }

    const { access_token } = await loginRes.json();
    console.log('✅ Token obtido com sucesso!');

    // Helper para chamadas autenticadas
    async function apiPost(endpoint: string, data: any) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error(`❌ Erro ao enviar para ${endpoint}:`, err);
            return null;
        }

        return response.json();
    }

    // 3. Cadastrando os Dados de Lavras
    console.log('\n🌆 Cadastrando Cidade: Lavras...');
    const cidade = await apiPost('/cidades', {
        nome: 'Lavras',
        estado: 'MG',
        slug: 'lavras-mg',
    });

    if (!cidade) {
        console.log('⚠️ Pulando seed (possivelmente a cidade já existe).');
        return;
    }
    const cidadeId = cidade.id;
    console.log(`✅ Lavras criada (ID: ${cidadeId})`);

    // Estrutura de Dados Levantada na Pesquisa
    const paroquiasData = [
        {
            nome: "Paróquia Sant'Ana",
            comunidades: [
                {
                    nome: "Matriz Sant'Ana",
                    bairro: "Centro",
                    endereco: "Rua Misseno de Pádua, 394",
                    missas: [
                        { dia_semana: 1, horario: "07:00" }, { dia_semana: 1, horario: "19:00" },
                        { dia_semana: 2, horario: "07:00" }, { dia_semana: 2, horario: "19:00" },
                        { dia_semana: 3, horario: "07:00" }, { dia_semana: 3, horario: "19:00" },
                        { dia_semana: 4, horario: "07:00" }, { dia_semana: 4, horario: "19:00" },
                        { dia_semana: 5, horario: "07:00" }, { dia_semana: 5, horario: "19:00" },
                        { dia_semana: 6, horario: "07:00" }, { dia_semana: 6, horario: "19:00" },
                        { dia_semana: 0, horario: "07:00" }, { dia_semana: 0, horario: "09:00" },
                        { dia_semana: 0, horario: "16:00" }, { dia_semana: 0, horario: "18:00" },
                        { dia_semana: 0, horario: "20:00" },
                    ]
                },
                {
                    nome: "Igreja do Rosário",
                    bairro: "Centro",
                    endereco: "Praça do Rosário",
                    missas: [
                        { dia_semana: 0, horario: "10:30" }, { dia_semana: 0, horario: "19:00" }
                    ]
                }
            ]
        },
        {
            nome: "Paróquia São Sebastião",
            comunidades: [
                {
                    nome: "Matriz São Sebastião",
                    bairro: "Arthur Bernardes",
                    endereco: "Rua Comandante Tavares, 54",
                    missas: [
                        { dia_semana: 2, horario: "19:00" }, { dia_semana: 4, horario: "19:00" },
                        { dia_semana: 5, horario: "19:00" }, { dia_semana: 6, horario: "19:00" },
                        { dia_semana: 0, horario: "07:00" }, { dia_semana: 0, horario: "09:00" },
                        { dia_semana: 0, horario: "19:30" }
                    ]
                },
                {
                    nome: "Comunidade Rainha da Paz",
                    bairro: "Nova Lavras",
                    endereco: "Não informado",
                    missas: [
                        { dia_semana: 0, horario: "17:30" }
                    ]
                }
            ]
        },
        {
            nome: "Paróquia Nossa Senhora de Fátima",
            comunidades: [
                {
                    nome: "Matriz Nossa Senhora de Fátima",
                    bairro: "Nova Lavras",
                    endereco: "Praça Nossa Senhora de Fátima",
                    missas: [
                        { dia_semana: 1, horario: "19:00" }, { dia_semana: 0, horario: "19:00" }
                    ]
                },
                {
                    nome: "Comunidade Santa Rita de Cássia",
                    bairro: "Vale do Sol",
                    endereco: "Vale do Sol",
                    missas: [
                        { dia_semana: 2, horario: "19:00" }, { dia_semana: 0, horario: "08:00" }
                    ]
                },
                {
                    nome: "Comunidade N.S. de Guadalupe",
                    bairro: "Pitangui",
                    endereco: "Pitangui",
                    missas: [
                        { dia_semana: 0, horario: "09:30" }
                    ]
                },
                {
                    nome: "Comunidade Sagrada Família",
                    bairro: "Vila Rica",
                    endereco: "Vila Rica",
                    missas: [
                        { dia_semana: 0, horario: "17:00" }
                    ]
                }
            ]
        },
        {
            nome: "Paróquia Nossa Senhora Auxiliadora",
            comunidades: [
                {
                    nome: "Matriz Nossa Senhora Auxiliadora",
                    bairro: "Esplanada",
                    endereco: "Bairro Esplanada",
                    missas: [
                        { dia_semana: 1, horario: "19:00" }, { dia_semana: 2, horario: "19:00" },
                        { dia_semana: 3, horario: "19:00" },
                        { dia_semana: 0, horario: "07:00" }, { dia_semana: 0, horario: "08:30" },
                        { dia_semana: 0, horario: "18:00" }, { dia_semana: 0, horario: "19:30" }
                    ]
                }
            ]
        },
        {
            nome: "Paróquia Nossa Senhora Aparecida",
            comunidades: [
                {
                    nome: "Matriz Nossa Senhora Aparecida",
                    bairro: "Vila Joaquim de Sales",
                    endereco: "Vila Joaquim de Sales",
                    missas: [
                        { dia_semana: 3, horario: "19:00" },
                        { dia_semana: 0, horario: "08:00" }, { dia_semana: 0, horario: "19:00" }
                    ]
                }
            ]
        }
    ];

    for (const pData of paroquiasData) {
        console.log(`\n⛪ Criando Paróquia: ${pData.nome}...`);
        const paroquia = await apiPost('/paroquias', { nome: pData.nome });
        if (!paroquia) continue;

        for (const cData of pData.comunidades) {
            console.log(`  🏠 Criando Comunidade: ${cData.nome}...`);
            const comunidade = await apiPost('/comunidades', {
                nome: cData.nome,
                bairro: cData.bairro,
                endereco: cData.endereco,
                paroquia_id: paroquia.id,
                cidade_id: cidadeId
            });
            if (!comunidade) continue;

            for (const mData of cData.missas) {
                await apiPost('/missas', {
                    comunidade_id: comunidade.id,
                    dia_semana: mData.dia_semana,
                    horario: mData.horario
                });
            }
            console.log(`    ✔️  Foram criados ${cData.missas.length} horários para ${cData.nome}.`);
        }
    }

    console.log('\n🎉 Seed finalizado com sucesso!');
}

seed().catch(console.error);
