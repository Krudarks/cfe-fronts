export interface Course {
    id: string;
    nombre: string;
    alumnos: number;
    opcion: string;
}

export const COURSES: Course[] = [
    { id: 'FIG-123', nombre: 'Cirugia Bucal', alumnos: 25, opcion: '...' },
    { id: 'FIG-122', nombre: 'Rehabilitacion Oral y estetica DENTAL', alumnos: 15, opcion: '...' },
    { id: 'FIG-121', nombre: 'Ortodoncia', alumnos: 16, opcion: '...' },
    { id: 'FIG-120', nombre: 'Rinomodelacion', alumnos: 18, opcion: '...' },
    { id: 'FIG-119', nombre: 'Implantologia', alumnos: 20, opcion: '...' },
    { id: 'FIG-118', nombre: 'Endodoncia', alumnos: 26, opcion: '...' },
    { id: 'FIG-117', nombre: 'Odontopeditria', alumnos: 10, opcion: '...' },
    { id: 'FIG-116', nombre: 'Marketing Digital', alumnos: 13, opcion: '...' }
];
