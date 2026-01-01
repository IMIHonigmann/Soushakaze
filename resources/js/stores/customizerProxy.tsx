import { Area, areas, Attachment } from '@/types/types';
import * as THREE from 'three';
import { proxy } from 'valtio';

export const factoryIssueAttachment: Attachment = {
    id: 0,
    name: 'Factory Issue',
    price_modifier: 0,
    area: 'all' as Area,
    power_modifier: 0,
    accuracy_modifier: 0,
    mobility_modifier: 0,
    handling_modifier: 0,
    magsize_modifier: 0,
};

export const vec3 = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);

export const state = proxy({
    grouped: {} as Record<string, Attachment[]>,
    selected: Object.values(areas).reduce(
        (acc, area) => {
            if (area === 'all' || area === 'other') return acc;
            acc[area] = factoryIssueAttachment;
            return acc;
        },
        {} as Record<string, Attachment>,
    ),
    cameraControlsEnabled: true,
    currentAreaSelection: 'all' as Area,
    dbAttachmentsToMaterialsObject: {} as Record<string, string[]>,
    mode: undefined as 'translate' | 'rotate' | 'scale' | undefined,
    currentMesh: {
        previousSelection: [] as string[],
        existingSelection: [] as string[],
        lastSelection: [] as string[],
    },
    nodeNames: [] as string[],
    CAMERA_POSITIONS: {
        stock: [vec3(0, 0, 0), vec3(-5, 0, 3)],
        magazine: [vec3(1.5, -0.75, 0), vec3(0, -1, 3)],
        scope: [vec3(0.75, 1, 0), vec3(-1.5, 1.75, 1.5)],
        underbarrel: [vec3(2, 0.45, 0), vec3(3.5, 2, -2)],
        all: [vec3(0, -0.35, 0), vec3(0, 0, 5)],
    } as Partial<Record<Area, [target: THREE.Vector3, position: THREE.Vector3]>>,
    action: null as 'ADDSINGLE' | 'CHANGESELECTION' | 'ADDMULTIPLE' | null,
    lastUpdateId: 0,
    lastListSearchId: 0,
});
