// === Variables globales ===
let provider, signer, contract;

const contractAddress = '0x4Dd6A8789A8FC51FD50B6A96EEbd484848e053BF'; 
const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_nom",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			}
		],
		"name": "creerProduit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_nouveauStatut",
				"type": "string"
			}
		],
		"name": "majStatutProduit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "nom",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "proprietaire",
				"type": "address"
			}
		],
		"name": "ProduitCree",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "nouveauStatut",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			}
		],
		"name": "StatutProduitMisAJour",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_nouveauProprietaire",
				"type": "address"
			}
		],
		"name": "transfererPropriete",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "ancienProprietaire",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "nouveauProprietaire",
				"type": "address"
			}
		],
		"name": "TransfertPropriete",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "validerLivraisonEtPayer",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getHistoriqueStatuts",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "prixLivraison",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "produits",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "nom",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "proprietaire",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "producteurOrigine",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "statut",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "dateDerniereMaj",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const roles = {
  "0xfD3f57Fc76010331454D82f81B0165A7A8d67759": "Ferme Songfack",
  "0xD4Fd550cd3c7C9B43A84b84fc1066Eb5C459deb0":"JusBio Compagnie",
  "0x475e01f8933CD2b30bFcA94Ed15e805ed1a4CE69": "Logistique",
  "0x427E23081d52fdf3Aed068f4F42E2DEE12E82b01" : "Carrefour Group"
};

function getRoleName(address) {
  return roles[address] || address;
}

function showMsg(id, msg, error=false) {
  const el = document.getElementById(id);
if (el){
	el.style.display = "block";
	  el.textContent = msg;
	  if (error) el.classList.add("error"); else el.classList.remove("error");
	  //setTimeout(() => { el.style.display = "none"; }, 60000);
	}
  
}

function afficherMessage(msg, error=false) {
  showMsg("messages", msg, error);
}

// === Connexion MetaMask ===
async function connect() {
  if (window.ethereum) {
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, abi, signer);
      const currentAddress = await signer.getAddress();
      showMsg("connectMsg", "Connecté à : " + getRoleName(currentAddress));
    } catch (err) {
    console.error(err);
      showMsg("connectMsg", "Connexion annulée ou refusée.", true);
    }
  } else {
    showMsg("connectMsg", "MetaMask non détecté.", true);
  }
}

// === Création de produit ===
async function creerProduit() {
  if (!contract) {
    afficherMessage("Veuillez d'abord connecter MetaMask.", true);
    return;
  }
  try {
    const id = document.getElementById('id-produit').value;
    const nom = document.getElementById('nom-produit').value;
    const desc = document.getElementById('desc-produit').value;
    const tx = await contract.creerProduit(id, nom, desc);
    await tx.wait();
    afficherMessage("Produit créé avec succès !");
    await remplirListeProduits();
  	document.getElementById('id-produit').value = "";
    document.getElementById('nom-produit').value = "";
    document.getElementById('desc-produit').value = "";
  } catch (err) {
    afficherMessage("Erreur création : " + (err.data?.message || err.message), true);
  }
}

// === Mise à jour du statut ===
// Fonction utilitaire pour extraire le message revert d'une erreur ethers.js
function extraireMessageErreur(error) {
  if (error.data && error.data.message) return error.data.message;
  if (error.reason) return error.reason;
  if (error.message) {
    const match = error.message.match(/execution reverted: (.*)/);
    if (match && match[1]) return match[1];
    return error.message;
  }
  return "Une erreur est survenue lors de la transaction.";
}

async function majStatutProduit() {
  if (!contract) {
    afficherMessage("Veuillez d'abord connecter MetaMask.", true);
    return;
  }

  try {
    const id = document.getElementById('id-statut').value?.trim();
    const statut = document.getElementById('nouveau-statut').value?.trim();

    if (!id) {
      alert("Veuillez sélectionner un produit avant de continuer.");
      return;
    }

    if (!statut) {
      alert("Veuillez sélectionner un statut valide.");
      return;
    }

    console.log(`Envoi de la mise à jour du statut: produit ID=${id}, nouveau statut="${statut}"`);

    const bnId = ethers.BigNumber.from(id);

    const tx = await contract.majStatutProduit(bnId, statut);
    await tx.wait();

    afficherMessage("Statut mis à jour avec succès !");
    // Réinitialiser les sélecteurs pour une prochaine sélection claire
    document.getElementById('id-statut').value = "";
    document.getElementById('nouveau-statut').value = "";

    // Rafraîchir l’affichage des stats et listes si ces fonctions existent
    if (typeof afficherStatsDashboard === "function") {
      await afficherStatsDashboard();
    }
    if (typeof remplirListeProduitsAutomatisation === "function") {
      await remplirListeProduitsAutomatisation();
    }

  } catch (err) {
    const messageErreur = extraireMessageErreur(err);
    if (messageErreur.toLowerCase().includes("vous n'etes pas le proprietaire") ||
        messageErreur.toLowerCase().includes("vous n'êtes pas le propriétaire")) {
      afficherMessage("Action interdite : vous n'êtes pas le propriétaire du produit.", true);
    } else {
      afficherMessage(`Erreur mise à jour : ${messageErreur}`, true);
    }
    console.error("Erreur majStatutProduit : ", err);
  }
}




// === Chargement liste de produit ===
async function remplirListeProduits() {
	const produits = await chargerListeProduits();
  
	const idsSelects = [
	  'id-statut',
	  'transfert-produit-select',
	  'produit-select',
	  'transfert-select'
	];
  
	idsSelects.forEach(id => {
	  const select = document.getElementById(id);
	  if (!select) return; // ⚠️ Ignore si l’élément n’existe pas dans cette page
  
	  // Reset le contenu
	  select.innerHTML = "";
	  const defaultOption = document.createElement('option');
	  defaultOption.value = "";
	  defaultOption.textContent = '-- Sélectionner un produit --';
	  select.appendChild(defaultOption);
  
	  // Remplir si produits disponibles
	  if (produits && produits.length) {
		produits.forEach(prod => {
		  const option = document.createElement('option');
		  option.value = prod.id;
		  option.textContent = `${prod.nom} (ID: ${prod.id})`;
		  select.appendChild(option);
		});
	  }
	});
  
	if (!produits || !produits.length) {
	  afficherMessage("Aucun produit trouvé. Vérifiez la connexion ou le réseau.", true);
	} 
  }
  

// Remplit la <select> des propriétaires depuis roles
function remplirListeProprietaires() {
  const proprietaireSelect = document.getElementById('proprietaire-select');
  if (!proprietaireSelect) {
    console.warn("remplirListeProprietaires: élément 'proprietaire-select' introuvable, sortie de la fonction.");
    return;
  }
  proprietaireSelect.innerHTML = '<option value="">-- Sélectionner un acteur --</option>';

  for (const [address, nom] of Object.entries(roles)) {
    const option = document.createElement('option');
    option.value = address;
    option.textContent = `${nom} (${address.substring(0,6)}...)`;
    proprietaireSelect.appendChild(option);
  }
}

// === Transfert de propriété ===
async function transfererPropriete() {
  if (!contract) {
    afficherMessage("Veuillez d'abord connecter MetaMask.", true);
    return;
  }
  try {
    const id = document.getElementById('transfert-produit-select').value;
    const nouveauProp = document.getElementById('proprietaire-select').value;
    const tx = await contract.transfererPropriete(id, nouveauProp);
    await tx.wait();
    afficherMessage("Propriété transférée !");
  } catch (err) {
    let message = "Erreur transfert : ";
    // Cherche le message du smart contract dans l'erreur
    const reason = err.reason || err.data?.message || err.message;
    if (reason && reason.includes("Vous n'etes pas le proprietaire")) {
      message = "Vous n'êtes pas le propriétaire de ce produit. Seul le propriétaire peut effectuer le transfert.";
    } else if (reason && reason.includes("UNPREDICTABLE_GAS_LIMIT")) {
      // Cas ethers.js : on peut aussi regarder si la raison du revert est présente dans err.error.message
      if (err.error && err.error.message && err.error.message.includes("Vous n'etes pas le proprietaire")) {
        message = "Vous n'êtes pas le propriétaire de ce produit. Seul le propriétaire peut effectuer le transfert.";
      } else {
        message += "La transaction a échoué. Vérifiez que vous êtes bien le propriétaire du produit.";
      }
    } else {
      message += reason;
    }
    afficherMessage(message, true);
  }
}

// === Récupérer tous les produits ===
async function chargerListeProduits() {
  if (!contract) return [];
  const events = await contract.queryFilter("ProduitCree");
  const produitsMap = {};
  events.forEach(ev => {
    produitsMap[ev.args.id.toString()] = ev.args.nom;
  });
  return Object.entries(produitsMap).map(([id, nom]) => ({ id, nom }));
}



// === Affichage de l'historique ===
async function afficherHistorique() {
  if (!contract) {
    afficherMessage("Veuillez d'abord connecter MetaMask.", true);
    return;
  }
  const select = document.getElementById('produit-select');
  const id = select.value;
  if (!id) {
    afficherMessage("Veuillez sélectionner un produit.", true);
    return;
  }
  try {
    const historiques = [];

    // Récupère les événements de création
    const eventsCreation = await contract.queryFilter(contract.filters.ProduitCree());
    for (const ev of eventsCreation) {
      if (ev.args.id.toString() === id) {
        const block = await provider.getBlock(ev.blockNumber);
        const date = new Date(Number(block.timestamp) * 1000);
        historiques.push({
          type: "creation",
          date: date,
          texte: `Création du produit par ${getRoleName(ev.args.proprietaire)}`
        });
      }
    }

    // Récupère les événements de changement de statut
    const eventsStatut = await contract.queryFilter(contract.filters.StatutProduitMisAJour());
    for (const ev of eventsStatut) {
      if (ev.args.id.toString() === id) {
        const date = new Date(Number(ev.args.date) * 1000);
        historiques.push({
          type: "statut",
          date: date,
          texte: `Statut : ${ev.args.nouveauStatut}`
        });
      }
    }

    // Récupère les événements de transfert
    const eventsTransfert = await contract.queryFilter(contract.filters.TransfertPropriete());
    for (const ev of eventsTransfert) {
      if (ev.args.id.toString() === id) {
        const block = await provider.getBlock(ev.blockNumber);
        const date = new Date(Number(block.timestamp) * 1000);
        historiques.push({
          type: "transfert",
          date: date,
          texte: `Transfert de ${getRoleName(ev.args.ancienProprietaire)} à ${getRoleName(ev.args.nouveauProprietaire)}`
        });
      }
    }

    // Trie par date croissante
    historiques.sort((a, b) => a.date - b.date);

    // Affiche dans la liste
    const ul = document.getElementById('liste-historique');
	if (!ul) return;
    ul.innerHTML = ""; // Vide la liste à chaque appel

    if (historiques.length === 0) {
      const li = document.createElement('li');
      li.innerText = "Aucun historique pour ce produit.";
      ul.appendChild(li);
    } else {
      historiques.forEach(item => {
        const li = document.createElement('li');
        const dateStr = item.date.toLocaleString();
        li.innerText = `[${dateStr}] ${item.texte}`;
        ul.appendChild(li);
      });
    }

    afficherMessage("Historique affiché.");
  } catch (err) {
    afficherMessage("Erreur affichage historique : " + (err.data?.message || err.message), true);
  }
}

// Affichage de l'historique des transferts pour un produit donné
async function afficherTransferts() {
  if (!contract) {
    afficherMessage("Veuillez d'abord connecter MetaMask.", true);
    return;
  }
  const select = document.getElementById('transfert-select');
  const id = select.value;
  if (!id) {
    afficherMessage("Veuillez sélectionner un produit.", true);
    return;
  }
  try {
    const eventsTransfert = await contract.queryFilter(contract.filters.TransfertPropriete());
    const transferts = [];
    for (const ev of eventsTransfert) {
      if (ev.args.id.toString() === id) {
        const block = await provider.getBlock(ev.blockNumber);
        const date = new Date(Number(block.timestamp) * 1000);
        transferts.push({
          date: date,
          texte: `Transfert de ${getRoleName(ev.args.ancienProprietaire)} à ${getRoleName(ev.args.nouveauProprietaire)}`
        });
      }
    }
    transferts.sort((a, b) => a.date - b.date);

    const ul = document.getElementById('liste-transferts');
	if (!ul) return;
    ul.innerHTML = "";
    if (transferts.length === 0) {
      const li = document.createElement('li');
      li.innerText = "Aucun transfert pour ce produit.";
      ul.appendChild(li);
    } else {
      transferts.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `[${item.date.toLocaleString()}] ${item.texte}`;
        ul.appendChild(li);
      });
    }
    afficherMessage("Transferts affichés.");
  } catch (err) {
    afficherMessage("Erreur affichage transferts : " + (err.data?.message || err.message), true);
  }
}

// Affichages des statistiques du dashboard
async function afficherStatsDashboard() {
  if (!contract) {
    console.log("Contrat non connecté. Impossible d'afficher les statistiques.");
    return;
  }

  try {
    // 1. Récupérer tous les produits (via les événements ProduitCree)
    const produitsCreesEvents = await contract.queryFilter(contract.filters.ProduitCree());
    const tousLesProduits = produitsCreesEvents.map(ev => ({
      id: ev.args.id.toString(),
      nom: ev.args.nom
    }));

    // Initialiser les compteurs de statut
    const statutsCounts = {
      "initial": 0,       // Nouvellement créés ou non reconnus
      "en production": 0,
      "en transit": 0,
      "livre": 0
    };

    // 2. Parcourir les produits pour déterminer leur statut actuel
    for (const prod of tousLesProduits) {
      try {
        const produitDetails = await contract.produits(prod.id);
        let statut = produitDetails.statut.trim().toLowerCase();

        // Normalisation des cas fréquents accentués
        if (statut === "créé" || statut === "cree") {
          statut = "initial";
        } else if (statut === "livré") {
          statut = "livre";
        }

        console.log(`Produit ID=${prod.id}, statut brut="${produitDetails.statut}", normalisé="${statut}"`);

        if (statutsCounts.hasOwnProperty(statut)) {
          statutsCounts[statut]++;
        } else if (statut === "") {
          statutsCounts["initial"]++;
        } else {
          console.warn(`Statut inconnu pour le produit ${prod.id}: "${statut}"`);
          statutsCounts["initial"]++;
        }
      } catch (err) {
        console.error(`Erreur lors de la récupération du statut pour le produit ${prod.id}:`, err);
        statutsCounts["initial"]++;
      }
    }

    // Mise à jour DOM avec protections contre éléments absents
    const totalEl = document.getElementById('total-products-count');
    if (totalEl) totalEl.textContent = tousLesProduits.length;

    const inProdEl = document.getElementById('in-production-count');
    if (inProdEl) inProdEl.textContent = statutsCounts["en production"];

    const inTransitEl = document.getElementById('in-transit-count');
    if (inTransitEl) inTransitEl.textContent = statutsCounts["en transit"];

    const deliveredEl = document.getElementById('delivered-count');
    if (deliveredEl) deliveredEl.textContent = statutsCounts["livre"];

    //afficherMessage("Statistiques du dashboard mises à jour.");

  } catch (error) {
    console.error("Erreur lors de l'affichage des statistiques du dashboard :", error);
    afficherMessage("Erreur lors du chargement des statistiques.", true);
  }
}

// Remplir la liste des produits "en transit" pour l'automatisation
async function remplirListeProduitsAutomatisation() {
  if (!contract) return;
  const select = document.getElementById('produit-automatisation');
  if (!select) return; 
  select.innerHTML = '<option value="">-- Sélectionner un produit en transit --</option>';
  const produits = await chargerListeProduits();
  for (const prod of produits) {
    const details = await contract.produits(prod.id);
    if (details.statut.toLowerCase() === "en transit") {
      const option = document.createElement('option');
      option.value = prod.id;
      option.textContent = `${prod.nom} (ID: ${prod.id})`;
      select.appendChild(option);
    }
  }
}


// === Liaisons des boutons ===
document.addEventListener("DOMContentLoaded", function() {
  const connectBtn = document.getElementById('connectButton');
  if (connectBtn) {
    connectBtn.addEventListener('click', async () => {
      await connect();
      if (typeof remplirListeProduits === "function") {
        await remplirListeProduits();
      }
      if (typeof remplirListeProprietaires === "function") {
        remplirListeProprietaires();
      }

      if (typeof remplirListeProduitsAutomatisation === "function" && document.getElementById('produit-automatisation')) {
        await remplirListeProduitsAutomatisation();
      }
      if (document.getElementById('total-products-count') && typeof afficherStatsDashboard === "function") {
        await afficherStatsDashboard();
      }
    });
  }

  if (document.getElementById('btnCreerProduit')) {
    document.getElementById('btnCreerProduit').addEventListener('click', async () => {
      await creerProduit();
      if (typeof remplirListeProduits === "function") await remplirListeProduits();
    });
  }
  if (document.getElementById('btnMajStatut')) {
    document.getElementById('btnMajStatut').addEventListener('click', majStatutProduit);
  }
  if (document.getElementById('btnTransferer')) {
    document.getElementById('btnTransferer').addEventListener('click', transfererPropriete);
  }
  if (document.getElementById('btnAfficherHistorique')) {
    document.getElementById('btnAfficherHistorique').addEventListener('click', afficherHistorique);
  }
  if (document.getElementById('btnAfficherTransferts')) {
    document.getElementById('btnAfficherTransferts').addEventListener('click', afficherTransferts);
  }
  if (document.getElementById('btnAutoLivraison')) {
  document.getElementById('btnAutoLivraison').addEventListener('click', async () => {
    if (!contract) {
      afficherMessage("Veuillez d'abord connecter MetaMask.", true);
      return;
    }
    const id = document.getElementById('produit-automatisation').value;

    if (!id) {
      afficherMessage("Veuillez sélectionner un produit en transit.", true);
      return;
    }
    try {
      const prixLivraison = ethers.utils.parseEther("0.01");
      const tx = await contract.validerLivraisonEtPayer(id, { value: prixLivraison });
      await tx.wait();
      afficherMessage("Livraison validée et paiement automatique effectué !");
      // Rafraîchir la liste si besoin
      if (typeof remplirListeProduitsAutomatisation === "function") {
        await remplirListeProduitsAutomatisation();
      }
    } catch (err) {
      afficherMessage("Erreur lors de la validation : " + (err.data?.message || err.message), true);
    }
    });
  }

});