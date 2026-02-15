Important Note: AI tools were used for reference, debugging assistance, and idea validation during development. 
All final implementation decisions, architecture, and refinements were performed independently.

PixiJS Slot Reel Animation Built with :
PixiJS v8
TypeScript
Vite
Modular architecture
Config-driven layout

Project Structure Used (based on given instructions)
src/
 ├─ config/
 │   └─ GameConfig.ts
 ├─ game/
 │   ├─ Reel.ts
 │   ├─ ReelController.ts
 │   └─ SlotGame.ts
 ├─ ui/
 │   └─ SpinButton.ts
 └─ index.ts

This version includes:

5x3 reel 
spin mechanics 
resize logic 
Ui button (it is created with pixi)

this version does not include :
RNG logic
payout calculation
sound system
Spine integration (did not find working spine that fits my usecase)


Random symbol selection used for demo purposes
The reel system is designed to be reused across multiple slot themes by changing configuration and assets only, without modifying core logic.


Setup Instructions
Install dependencies
npm install

Run development server
npm run dev (uses vite) || npx vite


Diffuculties faced :

Some of the provided art assets appeared slightly blurred when scaled to match the layout. Adjustments were made to scaling and positioning to maintain acceptable visual quality within the given constraints.
The provided Spine animation did not load successfully during integration. This may be due to export/runtime version compatibility or asset configuration differences.

What could i have done to make it better:
Introduce a structured view-building layer (e.g., a View Factory pattern) to construct screens from JSON-based layout definitions rather than instantiating elements directly within the game class.


