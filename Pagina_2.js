// document.addEventListener('DOMContentLoaded', function() {
//     const guestForm = document.getElementById('guestForm');
//     const confirmedList = document.getElementById('confirmed-guests');
//     const excludedList = document.getElementById('excluded-guests');
//     const convidadoSelect = document.getElementById('convidado');
    
//     guestForm.addEventListener('submit', function(event) {
//         event.preventDefault();
        
//         const guestName = convidadoSelect.value;
//         const confirmation = document.getElementById('confirmar').value;
        
//         if (guestName === "#") {
//             alert("Por favor, selecione um convidado.");
//             return;
//         }
        
//         const listItem = document.createElement('li');
//         listItem.textContent = guestName;

//         const deleteButton = document.createElement('button');
//         const deleteIcon = document.createElement('img');
//         deleteIcon.src = './excluir_2.png';
//         deleteIcon.alt = 'Excluir';
//         deleteButton.appendChild(deleteIcon);
//         listItem.appendChild(deleteButton);
        
//         if (confirmation === 'Sim') {
//             confirmedList.appendChild(listItem);
//         } else if (confirmation === 'Não') {
//             excludedList.appendChild(listItem);
//         }
        
//         deleteButton.addEventListener('click', function() {
//             if (confirm(`Deseja mesmo excluir ${guestName}?`)) {
//                 listItem.parentElement.removeChild(listItem);
//                 const option = document.createElement('option');
//                 option.value = guestName;
//                 option.textContent = guestName;
//                 convidadoSelect.appendChild(option);
//             }
//         });

//         // Remove the selected guest from the dropdown
//         convidadoSelect.remove(convidadoSelect.selectedIndex);
        
//         // Reset the form
//         guestForm.reset();
//     });
// });

document.addEventListener('DOMContentLoaded', function() {
    const guestForm = document.getElementById('guestForm');
    const confirmedList = document.getElementById('confirmed-guests');
    const excludedList = document.getElementById('excluded-guests');
    const convidadoSelect = document.getElementById('convidado');
    
    guestForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const guestName = convidadoSelect.value;
        const confirmation = document.getElementById('confirmar').value;
        
        if (guestName === "#") {
            alert("Por favor, selecione um convidado.");
            return;
        }
        
        const listItem = document.createElement('li');
        listItem.textContent = guestName;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<img src="./excluir_2.png" alt="Excluir">';
        listItem.appendChild(deleteButton);
        
        if (confirmation === 'Sim') {
            confirmedList.appendChild(listItem);
        } else if (confirmation === 'Não') {
            excludedList.appendChild(listItem);
        }
        
        deleteButton.addEventListener('click', async function() {
            if (confirm(`Deseja mesmo excluir ${guestName}?`)) {
                listItem.parentElement.removeChild(listItem);
                const option = document.createElement('option');
                option.value = guestName;
                option.textContent = guestName;
                convidadoSelect.appendChild(option);

                await fetch(`/.netlify/functions/guests?name=${guestName}`, {
                    method: 'DELETE'
                });
            }
        });

        // Envia dados ao servidor
        await fetch('/.netlify/functions/guests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: guestName,
                status: confirmation
            })
        });

        // Remove o convidado selecionado do dropdown
        convidadoSelect.remove(convidadoSelect.selectedIndex);
        
        // Reseta o formulário
        guestForm.reset();
    });

    // Carrega os dados ao carregar a página
    async function loadGuests() {
        const response = await fetch('/.netlify/functions/guests');
        const guests = await response.json();
        
        guests.forEach(guest => {
            const listItem = document.createElement('li');
            listItem.textContent = guest.name;
            
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<img src="./excluir_2.png" alt="Excluir">';
            listItem.appendChild(deleteButton);
            
            if (guest.status === 'Sim') {
                confirmedList.appendChild(listItem);
            } else if (guest.status === 'Não') {
                excludedList.appendChild(listItem);
            }

            deleteButton.addEventListener('click', async function() {
                if (confirm(`Deseja mesmo excluir ${guest.name}?`)) {
                    listItem.parentElement.removeChild(listItem);
                    const option = document.createElement('option');
                    option.value = guest.name;
                    option.textContent = guest.name;
                    convidadoSelect.appendChild(option);

                    await fetch(`/.netlify/functions/guests?name=${guest.name}`, {
                        method: 'DELETE'
                    });
                }
            });
        });
    }
    
    loadGuests();
});
