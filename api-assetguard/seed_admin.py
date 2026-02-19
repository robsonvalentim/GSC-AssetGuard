import sqlite3
import bcrypt
import uuid

def main():
    dbPath = 'database.sqlite'
    username = 'admin'
    password = '123'
    role = 'ADMIN_TI'

    print("Iniciando geracao do hash bcrypt (isso pode levar um segundo)...")
    
    # Gerando o salto e o hash da senha
    salt = bcrypt.gensalt(rounds=10)
    hashedPassword = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    # Gerando um identificador unico universal para o administrador
    userId = str(uuid.uuid4())

    print(f"Conectando ao banco de dados: {dbPath}")
    conn = sqlite3.connect(dbPath)
    cursor = conn.cursor()

    try:
        # Inserindo direto no SQLite, ignorando a API do NestJS por seguranca
        cursor.execute('''
            INSERT INTO users (id, username, password, role)
            VALUES (?, ?, ?, ?)
        ''', (userId, username, hashedPassword, role))
        
        conn.commit()
        print(f"Sucesso! Usuario '{username}' criado com a role '{role}'.")
    except sqlite3.IntegrityError:
        print(f"Aviso: O usuario '{username}' ja existe no banco de dados.")
    except Exception as e:
        print(f"Erro inesperado: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    main()