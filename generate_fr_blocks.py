import os
import json

EN_DIR = 'lang/en'
FR_DIR = 'lang/fr-CA'
PACK_INI_EN = 'langPack/en/pack.ini'
PACK_INI_FR = 'langPack/fr-CA/pack.ini'
def load_ini(path):
    mapping = {}
    if not os.path.exists(path):
        return mapping
    try:
        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or '=' not in line:
                    continue
                key, value = line.split('=', 1)
                mapping[key.strip()] = value.strip()
    except Exception as e:
        pass
    return mapping

def build_translation_map(en_map, fr_map):
    trans_map = {}
    for key, en_val in en_map.items():
        if key in fr_map:
            trans_map[en_val] = fr_map[key]
    
    defaults = {
        "Enabled": "Activé",
        "Disabled": "Désactivé",
        "Enable": "Activer",
        "Disable": "Désactiver",
        "Apply": "Appliquer",
        "Cancel": "Annuler",
        "Save": "Enregistrer",
        "Delete": "Supprimer",
        "Edit": "Éditer",
        "Add": "Ajouter",
        "Back": "Retour",
        "Next": "Suivant",
        "Close": "Fermer",
        "Refresh": "Actualiser",
        "Success": "Succès",
        "Error": "Erreur",
        "Fail": "Échec",
        "Status": "État",
        "Password": "Mot de passe",
        "User Name": "Nom d'utilisateur",
        "Username": "Nom d'utilisateur",
        "Description": "Description",
        "IP Address": "Adresse IP",
        "Mac Address": "Adresse MAC",
        "Interface": "Interface",
        "Port": "Port",
        "Protocol": "Protocole",
        "Time": "Temps",
        "Date": "Date",
        "System": "Système",
        "Yes": "Oui",
        "No": "Non",
        "OK": "OK",
        "Logout": "Déconnexion",
        "Home": "Accueil",
        "Basic Setup": "Configuration de base",
        "Advance Setup": "Configuration avancée",
        "Management": "Gestion",
        "Tools": "Outils",
        "Reboot": "Redémarrer",
        "Firmware Version": "Version du micrologiciel",
        "Hardware Version": "Version matérielle",
        "Model Name": "Nom du modèle",
        "Serial Number": "Numéro de série"
    }
    for k, v in defaults.items():
        if k not in trans_map:
            trans_map[k] = v
            
    return trans_map
def main():
    if not os.path.exists(FR_DIR):
        pass

    en_ini_map = load_ini(PACK_INI_EN)
    fr_ini_map = load_ini(PACK_INI_FR)
    
    trans_map = build_translation_map(en_ini_map, fr_ini_map)
    
    pack_ini_lines = []

    if os.path.exists(EN_DIR):
        files = [f for f in os.listdir(EN_DIR) if f.endswith('.json')]
        files.sort()
    else:
        files = []

    for filename in files:
        en_path = os.path.join(EN_DIR, filename)
        fr_path = os.path.join(FR_DIR, filename)
        
        try:
            with open(en_path, 'r', encoding='utf-8') as f:
                en_data = json.load(f)
        except Exception as e:
            continue

        def translate_obj(obj, prefix=""):
            new_obj = {}
            for k, v in obj.items():
                curr_key = f"{prefix}.{k}" if prefix else k
                if isinstance(v, dict):
                    new_obj[k] = translate_obj(v, curr_key)
                elif isinstance(v, str):
                    tr_val = trans_map.get(v, v)
                    new_obj[k] = tr_val
                    pack_ini_lines.append(f"{curr_key}={tr_val}")
                else:
                    new_obj[k] = v
            return new_obj

        new_fr_data = translate_obj(en_data)
        
        print(f"Explanation: Create/Update {fr_path}")
        print(f"````write file=\"{fr_path}\"")
        print(json.dumps(new_fr_data, indent=4, ensure_ascii=False))
        print("````")

    print(f"Explanation: Update {PACK_INI_FR}")
    print(f"````write file=\"{PACK_INI_FR}\"")
    for line in pack_ini_lines:
        print(line)
    print("````")

if __name__ == '__main__':
    main()
