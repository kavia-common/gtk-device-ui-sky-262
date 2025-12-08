#!/usr/bin/env python3
import os
import re
import json
import sys

# Paths relative to gtk-device-ui-sky-262 root
EN_PACK = 'langPack/en/pack.ini'
FR_PACK = 'langPack/fr-CA/pack.ini'
JSON_DIR = 'lang/fr-CA'

# Defaults for common words
DEFAULTS = {
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

def load_ini_map(path):
    m = {}
    if not os.path.exists(path):
        return m
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith(';') or line.startswith('#') or line.startswith('['):
                continue
            if '=' in line:
                k, v = line.split('=', 1)
                m[k.strip()] = v.strip()
    return m

def load_json_map(dir_path):
    m = {}
    if not os.path.exists(dir_path):
        return m
    
    for fname in os.listdir(dir_path):
        if not fname.endswith('.json'):
            continue
        
        fpath = os.path.join(dir_path, fname)
        base_name = os.path.splitext(fname)[0]
        
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            def flatten(obj, prefix):
                for k, v in obj.items():
                    full_k = f"{prefix}.{k}" if prefix else k
                    
                    if isinstance(v, dict):
                        flatten(v, full_k)
                    elif isinstance(v, str):
                        m[f"{base_name}.{full_k}"] = v
            
            flatten(data, "")
            
        except Exception as e:
            pass
            
    return m

def get_placeholders(text):
    return sorted(re.findall(r'(\{\d+\}|%[sd])', text))

def main():
    fr_ini_map = load_ini_map(FR_PACK)
    json_map = load_json_map(JSON_DIR)
    
    with open(EN_PACK, 'r', encoding='utf-8') as f:
        en_lines = f.readlines()
        
    output_lines = []
    
    for line in en_lines:
        stripped = line.strip()
        # Preserve empty lines and comments
        if not stripped or stripped.startswith(';') or stripped.startswith('#') or stripped.startswith('['):
            output_lines.append(line.rstrip('\n')) 
            continue
            
        if '=' in stripped:
            key, en_val = stripped.split('=', 1)
            key = key.strip()
            en_val = en_val.strip()
            
            fr_val = None
            
            # 1. Check existing FR ini
            if key in fr_ini_map:
                candidate = fr_ini_map[key]
                if get_placeholders(en_val) == get_placeholders(candidate):
                    fr_val = candidate
            
            # 2. Check JSONs
            if fr_val is None:
                if key in json_map:
                    candidate = json_map[key]
                    if get_placeholders(en_val) == get_placeholders(candidate):
                         fr_val = candidate
            
            # 3. Defaults
            if fr_val is None:
                if en_val in DEFAULTS:
                    fr_val = DEFAULTS[en_val]
            
            # 4. Fallback to English
            if fr_val is None:
                fr_val = en_val
            
            output_lines.append(f"{key}={fr_val}")
        else:
            output_lines.append(line.rstrip('\n'))

    with open(FR_PACK, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_lines))

if __name__ == '__main__':
    main()
