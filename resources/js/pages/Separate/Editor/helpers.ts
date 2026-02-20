import { state } from '@/stores/customizerProxy';

export function addSingleMeshToSelection(element: string) {
    state.action = 'ADDSINGLE';
    state.currentMesh.previousSelection = [...state.currentMesh.existingSelection];
    state.currentMesh.previousSelection = [...state.currentMesh.existingSelection];
    state.currentMesh.existingSelection.push(element);
    state.currentMesh.lastSelection = [element];
    state.lastUpdateId++;
}

export function changeMeshSelection(elements: string[]) {
    state.action = 'CHANGESELECTION';
    state.currentMesh.previousSelection = [...state.currentMesh.existingSelection];
    state.currentMesh.existingSelection = elements;
    state.currentMesh.lastSelection = elements;
    state.lastUpdateId++;
}
