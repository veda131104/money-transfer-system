# Quick Start Guide

## Prerequisites

1. **Java 17** - Required for the backend (Spring Boot 3.3.11)
2. **MySQL** - Required for the database
3. **Node.js** (v18+ recommended) - For Angular frontend
4. **Maven** - For building Spring Boot backend
5. **Angular CLI** - For frontend development

## Database Setup

### Create MySQL Database

```sql
CREATE DATABASE IF NOT EXISTS money_transfer_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Configuration

The database credentials are configured in `src/main/resources/application.yml`:
- **URL**: `jdbc:mysql://localhost:3306/money_transfer_system`
- **Username**: `root`
- **Password**: `Root123$`

**NOTE**: Update these credentials if your MySQL setup is different.

### Schema

The database schema is automatically created when the application starts (Hibernate ddl-auto: update).

## Running the Project

### Option 1: Using VS Code Tasks

#### Start Backend
1. Open VS Code
2. Press `Ctrl+Shift+D` (or use Terminal → Run Task)
3. Select **"Backend: Run Spring Boot (mvn spring-boot:run)"**
4. Backend will start on `http://localhost:8080`

#### Start Frontend
1. Open a new terminal in VS Code
2. Press `Ctrl+Shift+D`
3. Select **"Frontend: Serve (ng serve)"**
4. The application will automatically open at `http://localhost:4200`

### Option 2: Manual Commands

#### Backend
```bash
cd c:\capstone\money-transfer-system
mvn clean package -DskipTests
java -jar target/mts-0.0.1-SNAPSHOT.jar
```

Or use Spring Boot Maven plugin:
```bash
mvn spring-boot:run
```

#### Frontend
```bash
cd c:\capstone\money-transfer-system\frontend
npm install
npx ng serve --open
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/login-with-token` - Login with magic token
- `GET /api/v1/auth/credentials/{token}` - Get credentials by remember token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `GET /api/v1/auth/verify-token` - Verify magic link
- `POST /api/v1/auth/reset-password` - Reset password

### Account Management
- `GET /api/v1/accounts/{accountId}` - Get account details
- `POST /api/v1/accounts/setup` - Setup account

### Transactions
- `POST /api/v1/transfer/send-money` - Send money transfer
- `GET /api/v1/transfer/history` - Get transaction history

## Frontend Features

- **Login/Signup** - User authentication
- **Dashboard** - View account information
- **Transfer** - Send money to other accounts
- **History** - View transaction history
- **Profile** - User profile management
- **Reset Password** - Password recovery

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:

**Backend (8080)**:
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Frontend (4200)**:
```bash
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### MySQL Connection Issues
1. Ensure MySQL is running: `mysql -u root -p`
2. Create the database if it doesn't exist
3. Verify credentials in `application.yml`
4. Check MySQL is listening on localhost:3306

### Frontend Build Issues
```bash
cd frontend
rm -r node_modules
npm install
npx ng build
```

### Backend Build Issues
```bash
mvn clean
mvn compile
mvn package -DskipTests
```

## Testing

### Backend Tests (if needed)
```bash
mvn test
```

### Frontend Tests (if needed)
```bash
cd frontend
npx ng test
```

## Development

### Backend
- **Main class**: `com.company.mts.Main`
- **Controllers**: `src/main/java/com/company/mts/controller/`
- **Services**: `src/main/java/com/company/mts/service/`
- **Entities**: `src/main/java/com/company/mts/entity/`

### Frontend
- **Components**: `frontend/src/app/`
- **Services**: `frontend/src/app/services/`
- **Styles**: Using Angular Material and SCSS

## Default Credentials (for testing)

After signup, you can login with:
- Email: `your-email@example.com`
- Password: `your-password` (min 8 characters)

## Email Configuration

Email notifications are configured in `application.yml`:
- SMTP Host: `smtp.gmail.com`
- Port: `587`
- Uses Gmail app-specific password for authentication
- Update credentials if using a different email service
