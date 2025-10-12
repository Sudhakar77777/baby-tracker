**Baby Tracker App — Local-Only MVP Plan**

---

**Tech Stack**

- Language: TypeScript
- Framework: React Native (Expo)
- Package Manager: pnpm
- Local Storage: expo-sqlite (native), sql.js (web planned)
- State Management: React Context + local component state (no Zustand or Redux)
- Navigation: React Navigation
- Date Handling: dayjs
- Styling: StyleSheet or Tailwind (NativeWind) TBD

---

**Setup Instructions**

1. Create Expo project with TypeScript template:
   `pnpm create expo-app baby-tracker --template expo-template-blank-typescript`
   `cd baby-tracker`
   `pnpm install`

2. To enable web for testing quick, do this first:
   `npx expo install react-dom react-native-web`
   `pnpm install`

3. Then restart the project:
   `pnpm expo start`

4. Press:
   `w` # to open web in browser

---

**Folder Structure**

- assets/
- src/

  - components/ (UI components)
  - screens/ (Home, AddActivity, ActivityLog, ManageKids)
  - db/ (SQLite schema, DB access)
  - context/ (React Context for app state)
  - types/ (TypeScript types/interfaces)
  - constants/
  - utils/
  - storage/ (platform-specific storage abstraction)

- App.tsx
- plan.txt (this plan)

---

**MVP Features**

- Add activity (feeding, sleep, diaper, etc.)
- View activity log (by date, kid)
- Daily summary screen
- Manage multiple kids
- All data stored locally
- Type-safe forms and models
- Responsive for Android, iOS, Web (web storage planned separately)

---

**Activity Types**

- Feeding (breast, bottle, side, amount, time)
- Sleep (start/end/duration)
- Diaper changes (wet, dirty, both)
- Bathing
- Medication
- Notes or milestones

---

**State Management**

- Use React Context for:

  - Selected kid
  - Theme (light/dark)
  - Current date context

- Use local `useState` or `useReducer` for form inputs and UI state
- No Zustand or Redux for MVP

---

**Database Design**

- Table `kids`:

  - id (UUID)
  - name (TEXT)
  - birthdate (TEXT)

- Table `activities`:

  - id (UUID)
  - kid_id (UUID)
  - type (TEXT)
  - timestamp (INTEGER)
  - duration (INTEGER)
  - details_json (TEXT)
  - created_at (INTEGER)
  - updated_at (INTEGER)

---

**Implementation Steps**

1. Project Setup

   - Create Expo project, install dependencies:
     `pnpm add expo-sqlite react-navigation dayjs uuid`
     `pnpm add -D @types/uuid`

npx expo install @react-navigation/native
pnpm add react-native-screens react-native-safe-area-context
pnpm add @react-navigation/native-stack
pnpm add dayjs uuid
pnpm add -D @types/uuid
npx expo install expo-sqlite
pnpm add @react-native-async-storage/async-storage
npx expo install @react-native-async-storage/async-storage
pnpm add react-native-paper react-native-paper-dates date-fns
pnpm add -D @types/react-native
npm install react-native-paper
npm install react-native-vector-icons
npx expo install expo-image-picker
npm install react-native-uuid

pnpm install

2. SQLite Integration

   - Setup DB schema and connection files
   - Implement methods to insert and query kids and activities

3. Screens

   - HomeScreen: daily summary, recent activities
   - AddActivityScreen: add new activity form
   - ActivityLogScreen: list of past activities with filters
   - ManageKidsScreen: add/edit/delete kids

4. Context Setup

   - Create AppContext with selected kid, theme, current date

5. Core Features

   - Add activity form with validation
   - Activity list with filters
   - Summary metrics
   - Kid management
   - Dark mode toggle

---

**Optional Future Features (Phase 3)**

- Export data as JSON or CSV (query DB directly)
- Local notifications/reminders (use expo-notifications)
- Light/Dark theme (React Context + theming)
- Biometrics lock (expo-local-authentication)
- Backup to file (expo-file-system)

_No Zustand or Redux needed for these._

---

**Web Compatibility Plan**

- Use `expo-sqlite` on Android/iOS
- Use `sql.js` (SQLite compiled to WASM) on Web
- Abstract storage behind a common interface that picks the right backend

---

**Estimated Timeline**

| Task                    | Time     |
| ----------------------- | -------- |
| Setup & SQLite DB       | 1 day    |
| Add Activity + DB logic | 1–2 days |
| Activity Log UI         | 1 day    |
| Home Summary Screen     | 1 day    |
| Kid Management          | 1 day    |
| Context Setup           | 0.5 day  |
| Testing & Polish        | 1–2 days |

---

**Next Steps**

- Set up project & install dependencies
- Scaffold DB schema & storage layer
- Build React Context for global state
- Build core screens & connect DB
- Plan optional features after MVP

---

**Notes**

- Keep logic modular and simple for future sync support
- Use UUIDs and timestamps from the start
- Avoid premature optimization — focus on MVP

---

**Packaging notes**

sudo npm install -g eas-cli

eas --version

eas login

eas build:configure

eas build -p android --profile preview --local

Successfully built app
APK: ./dist/my-app.apk

java -version
sudo apt update
sudo apt install openjdk-17-jdk
java -version
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
echo $JAVA_HOME

export ANDROID_SDK_ROOT=/mnt/c/Users/SudhakarBalakrishnan/AppData/Local/Android/Sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/tools
export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
adb --version
adb.exe --version

eas build --local --platform android

# Download bundletool if you haven't

wget https://github.com/google/bundletool/releases/download/1.15.6/bundletool-all-1.15.6.jar -O bundletool.jar

# Generate APKs from AAB

java -jar bundletool.jar build-apks \
 --bundle=build-1760309136631.aab \
 --output=output.apks \
 --mode=universal \
 --ks=your-release-key.jks \
 --ks-key-alias=your-key-alias \
 --ks-pass=pass:your-keystore-password \
 --key-pass=pass:your-key-password

# Extract universal APK

unzip output.apks universal.apk
