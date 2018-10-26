import { Component, Inject, OnInit, ViewEncapsulation, OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocompleteTrigger } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Visit } from '../visit.model';
import { ToastrService } from 'ngx-toastr';
import { medication } from '../../../medication/medication.model';
import { ContactsService } from '../../../medication/medication.service';
import { OccassionService } from '../occassionService.model';
import { DataSource } from '@angular/cdk/table';
import { PatientService } from '../../patient.service';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { MedicationFormComponent } from '../medication-form/medication-form.component'
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { ActivatedRoute } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { FusePatientInfoComponent } from '../patient-info.component';
import { ServiceVisitNode } from '../visit-service.service';
import { MasterConfig } from '../../masterconfig.model'
import { fuseAnimations } from '../../../../../core/animations';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TemplateFirebaseService } from '../../../template/templateFirebase.Service';
import { Template } from '../../../template/template.model';
import { Subscription } from 'rxjs/Subscription';
import { FusePatientInfoService } from '../patient-info.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { PatientInfo } from '../patient-info.model'
import { FuseUtils } from '../../../../../core/fuseUtils';
import { Contact} from '../../../users/contact.model';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

export class activity {
  id: string;
  by: string;
  action: string;
  time: string;
  date: string;
  constructor(activity?) {
    this.id = FuseUtils.generateGUID();
    this.by = activity.by;
    this.action = activity.action;
    this.time = new Date().toLocaleTimeString();
    this.date = new Date().toLocaleDateString();
  }
}

@Component({
  selector: 'app-visit-notes-form',
  templateUrl: './visit-note-form.component.html',
  styleUrls: ['./visit-note-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewVisitNoteFormComponent implements OnInit {

  dialogTitle: string;
  visitForm: FormGroup;
  contactForm: FormGroup;
  ocsForm: FormGroup;
  action: string;
  medicationForm: FormGroup;
  patientName: string;

  patient: PatientInfo;
  medication: medication;
  visit_record: Visit;
  ocassion: OccassionService;

  patientinfo: FusePatientInfoComponent
  isLinear = false;
  id: any;
  ocsData: any;
  dataSource: any;

  route: string;
  categories: any[];

  section1: FormGroup;
  section2: FormGroup;
  section3: FormGroup;
  section4: FormGroup;
  currentUser : Contact;

  //icd10 autocomplete Tag
  autoCompleteChipList: FormControl = new FormControl();
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  options = [
    { code: 'A000', name: "Cholera due to Vibrio cholerae 01, biovar cholerae" },
    { code: 'A001', name: "Cholera due to Vibrio cholerae 01, biovar eltor" },
    { code: 'A009', name: "Cholera, unspecified" },
    { code: 'A0100', name: "Typhoid fever, unspecified" },
    { code: 'A0101', name: "Typhoid meningitis" },
    { code: 'A0102', name: "Typhoid fever with heart involvement" },
    { code: 'A0103', name: "Typhoid pneumonia" },
    { code: 'A0104', name: "Typhoid arthritis" },
    { code: 'A0105', name: "Typhoid osteomyelitis" },
    { code: 'A0109', name: "Typhoid fever with other complications" },
    { code: 'A011', name: "Paratyphoid fever A" },
    { code: 'A012', name: "Paratyphoid fever B" },
    { code: 'A013', name: "Paratyphoid fever C" },
    { code: 'A014', name: "Paratyphoid fever, unspecified" },
    { code: 'A020', name: "Salmonella enteritis" },
    { code: 'A021', name: "Salmonella sepsis" },
    { code: 'A0220', name: "Localized salmonella infection, unspecified" },
    { code: 'A0221', name: "Salmonella meningitis" },
    { code: 'A0222', name: "Salmonella pneumonia" },
    { code: 'A0223', name: "Salmonella arthritis" },
    { code: 'A0224', name: "Salmonella osteomyelitis" },
    { code: 'A0225', name: "Salmonella pyelonephritis" },
    { code: 'A0229', name: "Salmonella with other localized infection" },
    { code: 'A028', name: "Other specified salmonella infections" },
    { code: 'A029', name: "Salmonella infection, unspecified" },
    { code: 'A030', name: "Shigellosis due to Shigella dysenteriae" },
    { code: 'A031', name: "Shigellosis due to Shigella flexneri" },
    { code: 'A032', name: "Shigellosis due to Shigella boydii" },
    { code: 'A033', name: "Shigellosis due to Shigella sonnei" },
    { code: 'A038', name: "Other shigellosis" },
    { code: 'A039', name: "Shigellosis, unspecified" },
    { code: 'A040', name: "Enteropathogenic Escherichia coli infection" },
    { code: 'A041', name: "Enterotoxigenic Escherichia coli infection" },
    { code: 'A042', name: "Enteroinvasive Escherichia coli infection" },
    { code: 'A043', name: "Enterohemorrhagic Escherichia coli infection" },
    { code: 'A044', name: "Other intestinal Escherichia coli infections" },
    { code: 'A045', name: "Campylobacter enteritis" },
    { code: 'A046', name: "Enteritis due to Yersinia enterocolitica" },
    { code: 'A047', name: "Enterocolitis due to Clostridium difficile" },
    { code: 'A048', name: "Other specified bacterial intestinal infections" },
    { code: 'A049', name: "Bacterial intestinal infection, unspecified" },
    { code: 'A050', name: "Foodborne staphylococcal intoxication" },
    { code: 'A051', name: "Botulism food poisoning" },
    { code: 'A052', name: "Foodborne Clostridium perfringens [Clostridium welchii] intoxication" },
    { code: 'A053', name: "Foodborne Vibrio parahaemolyticus intoxication" },
    { code: 'A054', name: "Foodborne Bacillus cereus intoxication" },
    { code: 'A055', name: "Foodborne Vibrio vulnificus intoxication" },
    { code: 'A058', name: "Other specified bacterial foodborne intoxications" },
    { code: 'A059', name: "Bacterial foodborne intoxication, unspecified" },
    { code: 'A060', name: "Acute amebic dysentery" },
    { code: 'A061', name: "Chronic intestinal amebiasis" },
    { code: 'A062', name: "Amebic nondysenteric colitis" },
    { code: 'A063', name: "Ameboma of intestine" },
    { code: 'A064', name: "Amebic liver abscess" },
    { code: 'A065', name: "Amebic lung abscess" },
    { code: 'A066', name: "Amebic brain abscess" },
    { code: 'A067', name: "Cutaneous amebiasis" },
    { code: 'A0681', name: "Amebic cystitis" },
    { code: 'A0682', name: "Other amebic genitourinary infections" },
    { code: 'A0689', name: "Other amebic infections" },
    { code: 'A069', name: "Amebiasis, unspecified" },
    { code: 'A070', name: "Balantidiasis" },
    { code: 'A071', name: "Giardiasis [lambliasis]" },
    { code: 'A072', name: "Cryptosporidiosis" },
    { code: 'A073', name: "Isosporiasis" },
    { code: 'A074', name: "Cyclosporiasis" },
    { code: 'A078', name: "Other specified protozoal intestinal diseases" },
    { code: 'A079', name: "Protozoal intestinal disease, unspecified" },
    { code: 'A080', name: "Rotaviral enteritis" },
    { code: 'A0811', name: "Acute gastroenteropathy due to Norwalk agent" },
    { code: 'A0819', name: "Acute gastroenteropathy due to other small round viruses" },
    { code: 'A082', name: "Adenoviral enteritis" },
    { code: 'A0831', name: "Calicivirus enteritis" },
    { code: 'A0832', name: "Astrovirus enteritis" },
    { code: 'A0839', name: "Other viral enteritis" },
    { code: 'A084', name: "Viral intestinal infection, unspecified" },
    { code: 'A088', name: "Other specified intestinal infections" },
    { code: 'A09', name: " Infectious gastroenteritis and colitis, unspecified" },
    { code: 'A150', name: "Tuberculosis of lung" },
    { code: 'A154', name: "Tuberculosis of intrathoracic lymph nodes" },
    { code: 'A155', name: "Tuberculosis of larynx, trachea and bronchus" },
    { code: 'A156', name: "Tuberculous pleurisy" },
    { code: 'A157', name: "Primary respiratory tuberculosis" },
    { code: 'A158', name: "Other respiratory tuberculosis" },
    { code: 'A159', name: "Respiratory tuberculosis unspecified" },
    { code: 'A170', name: "Tuberculous meningitis" },
    { code: 'A171', name: "Meningeal tuberculoma" },
    { code: 'A1781', name: "Tuberculoma of brain and spinal cord" },
    { code: 'A1782', name: "Tuberculous meningoencephalitis" },
    { code: 'A1783', name: "Tuberculous neuritis" },
    { code: 'A1789', name: "Other tuberculosis of nervous system" },
    { code: 'A179', name: "Tuberculosis of nervous system, unspecified" },
    { code: 'A1801', name: "Tuberculosis of spine" },
    { code: 'A1802', name: "Tuberculous arthritis of other joints" },
    { code: 'A1803', name: "Tuberculosis of other bones" },
    { code: 'A1809', name: "Other musculoskeletal tuberculosis" },
    { code: 'A1810', name: "Tuberculosis of genitourinary system, unspecified" },
    { code: 'A1811', name: "Tuberculosis of kidney and ureter" },
    { code: 'A1812', name: "Tuberculosis of bladder" },
    { code: 'A1813', name: "Tuberculosis of other urinary organs" },
    { code: 'A1814', name: "Tuberculosis of prostate" },
    { code: 'A1815', name: "Tuberculosis of other male genital organs" },
    { code: 'A1816', name: "Tuberculosis of cervix" },
    { code: 'A1817', name: "Tuberculous female pelvic inflammatory disease" },
    { code: 'A1818', name: "Tuberculosis of other female genital organs" },
    { code: 'A182', name: "Tuberculous peripheral lymphadenopathy" },
    { code: 'A1831', name: "Tuberculous peritonitis" },
    { code: 'A1832', name: "Tuberculous enteritis" },
    { code: 'A1839', name: "Retroperitoneal tuberculosis" },
    { code: 'A184', name: "Tuberculosis of skin and subcutaneous tissue" },
    { code: 'A1850', name: "Tuberculosis of eye, unspecified" },
    { code: 'A1851', name: "Tuberculous episcleritis" },
    { code: 'A1852', name: "Tuberculous keratitis" },
    { code: 'A1853', name: "Tuberculous chorioretinitis" },
    { code: 'A1854', name: "Tuberculous iridocyclitis" },
    { code: 'A1859', name: "Other tuberculosis of eye" },
    { code: 'A186', name: "Tuberculosis of (inner) (middle) ear" },
    { code: 'A187', name: "Tuberculosis of adrenal glands" },
    { code: 'A1881', name: "Tuberculosis of thyroid gland" },
    { code: 'A1882', name: "Tuberculosis of other endocrine glands" },
    { code: 'A1883', name: "Tuberculosis of digestive tract organs, not elsewhere classified" },
    { code: 'A1884', name: "Tuberculosis of heart" },
    { code: 'A1885', name: "Tuberculosis of spleen" },
    { code: 'A1889', name: "Tuberculosis of other sites" },
    { code: 'A190', name: "Acute miliary tuberculosis of a single specified site" },
    { code: 'A191', name: "Acute miliary tuberculosis of multiple sites" },
    { code: 'A192', name: "Acute miliary tuberculosis, unspecified" },
    { code: 'A198', name: "Other miliary tuberculosis" },
    { code: 'A199', name: "Miliary tuberculosis, unspecified" },
    { code: 'A200', name: "Bubonic plague" },
    { code: 'A201', name: "Cellulocutaneous plague" },
    { code: 'A202', name: "Pneumonic plague" },
    { code: 'A203', name: "Plague meningitis" },
    { code: 'A207', name: "Septicemic plague" },
    { code: 'A208', name: "Other forms of plague" },
    { code: 'A209', name: "Plague, unspecified" },
    { code: 'A210', name: "Ulceroglandular tularemia" },
    { code: 'A211', name: "Oculoglandular tularemia" },
    { code: 'A212', name: "Pulmonary tularemia" },
    { code: 'A213', name: "Gastrointestinal tularemia" },
    { code: 'A217', name: "Generalized tularemia" },
    { code: 'A218', name: "Other forms of tularemia" },
    { code: 'A219', name: "Tularemia, unspecified" },
    { code: 'A220', name: "Cutaneous anthrax" },
    { code: 'A221', name: "Pulmonary anthrax" },
    { code: 'A222', name: "Gastrointestinal anthrax" },
    { code: 'A227', name: "Anthrax sepsis" },
    { code: 'A228', name: "Other forms of anthrax" },
    { code: 'A229', name: "Anthrax, unspecified" },
    { code: 'A230', name: "Brucellosis due to Brucella melitensis" },
    { code: 'A231', name: "Brucellosis due to Brucella abortus" },
    { code: 'A232', name: "Brucellosis due to Brucella suis" },
    { code: 'A233', name: "Brucellosis due to Brucella canis" },
    { code: 'A238', name: "Other brucellosis" },
    { code: 'A239', name: "Brucellosis, unspecified" },
    { code: 'A240', name: "Glanders" },
    { code: 'A241', name: "Acute and fulminating melioidosis" },
    { code: 'A242', name: "Subacute and chronic melioidosis" },
    { code: 'A243', name: "Other melioidosis" },
    { code: 'A249', name: "Melioidosis, unspecified" },
    { code: 'A250', name: "Spirillosis" },
    { code: 'A251', name: "Streptobacillosis" },
    { code: 'A259', name: "Rat-bite fever, unspecified" },
    { code: 'A260', name: "Cutaneous erysipeloid" },
    { code: 'A267', name: "Erysipelothrix sepsis" },
    { code: 'A268', name: "Other forms of erysipeloid" },
    { code: 'A269', name: "Erysipeloid, unspecified" },
    { code: 'A270', name: "Leptospirosis icterohemorrhagica" },
    { code: 'A2781', name: "Aseptic meningitis in leptospirosis" },
    { code: 'A2789', name: "Other forms of leptospirosis" },
    { code: 'A279', name: "Leptospirosis, unspecified" },
    { code: 'A280', name: "Pasteurellosis" },
    { code: 'A281', name: "Cat-scratch disease" },
    { code: 'A282', name: "Extraintestinal yersiniosis" },
    { code: 'A288', name: "Other specified zoonotic bacterial diseases, not elsewhere classified" },
    { code: 'A289', name: "Zoonotic bacterial disease, unspecified" },
    { code: 'A300', name: "Indeterminate leprosy" },
    { code: 'A301', name: "Tuberculoid leprosy" },
    { code: 'A302', name: "Borderline tuberculoid leprosy" },
    { code: 'A303', name: "Borderline leprosy" },
    { code: 'A304', name: "Borderline lepromatous leprosy" },
    { code: 'A305', name: "Lepromatous leprosy" },
    { code: 'A308', name: "Other forms of leprosy" },
    { code: 'A309', name: "Leprosy, unspecified" },
    { code: 'A310', name: "Pulmonary mycobacterial infection" },
    { code: 'A311', name: "Cutaneous mycobacterial infection" },
    { code: 'A312', name: "Disseminated mycobacterium avium-intracellulare complex (DMAC)" },
    { code: 'A318', name: "Other mycobacterial infections" },
    { code: 'A319', name: "Mycobacterial infection, unspecified" },
    { code: 'A320', name: "Cutaneous listeriosis" },
    { code: 'A3211', name: "Listerial meningitis" },
    { code: 'A3212', name: "Listerial meningoencephalitis" },
    { code: 'A327', name: "Listerial sepsis" },
    { code: 'A3281', name: "Oculoglandular listeriosis" },
    { code: 'A3282', name: "Listerial endocarditis" },
    { code: 'A3289', name: "Other forms of listeriosis" },
    { code: 'A329', name: "Listeriosis, unspecified" },
    { code: 'A33', name: " Tetanus neonatorum" },
    { code: 'A34', name: " Obstetrical tetanus" },
    { code: 'A35', name: " Other tetanus" },
    { code: 'A360', name: "Pharyngeal diphtheria" },
    { code: 'A361', name: "Nasopharyngeal diphtheria" },
    { code: 'A362', name: "Laryngeal diphtheria" },
    { code: 'A363', name: "Cutaneous diphtheria" },
    { code: 'A3681', name: "Diphtheritic cardiomyopathy" },
    { code: 'A3682', name: "Diphtheritic radiculomyelitis" },
    { code: 'A3683', name: "Diphtheritic polyneuritis" },
    { code: 'A3684', name: "Diphtheritic tubulo-interstitial nephropathy" },
    { code: 'A3685', name: "Diphtheritic cystitis" },
    { code: 'A3686', name: "Diphtheritic conjunctivitis" },
    { code: 'A3689', name: "Other diphtheritic complications" },
    { code: 'A369', name: "Diphtheria, unspecified" },
    { code: 'A3700', name: "Whooping cough due to Bordetella pertussis without pneumonia" },
    { code: 'A3701', name: "Whooping cough due to Bordetella pertussis with pneumonia" },
    { code: 'A3710', name: "Whooping cough due to Bordetella parapertussis without pneumonia" },
    { code: 'A3711', name: "Whooping cough due to Bordetella parapertussis with pneumonia" },
    { code: 'A3780', name: "Whooping cough due to other Bordetella species without pneumonia" },
    { code: 'A3781', name: "Whooping cough due to other Bordetella species with pneumonia" },
    { code: 'A3790', name: "Whooping cough, unspecified species without pneumonia" },
    { code: 'A3791', name: "Whooping cough, unspecified species with pneumonia" },
    { code: 'A380', name: "Scarlet fever with otitis media" },
    { code: 'A381', name: "Scarlet fever with myocarditis" },
    { code: 'A388', name: "Scarlet fever with other complications" },
    { code: 'A389', name: "Scarlet fever, uncomplicated" },
    { code: 'A390', name: "Meningococcal meningitis" },
    { code: 'A391', name: "Waterhouse-Friderichsen syndrome" },
    { code: 'A392', name: "Acute meningococcemia" },
    { code: 'A393', name: "Chronic meningococcemia" },
    { code: 'A394', name: "Meningococcemia, unspecified" },
    { code: 'A3950', name: "Meningococcal carditis, unspecified" },
    { code: 'A3951', name: "Meningococcal endocarditis" },
    { code: 'A3952', name: "Meningococcal myocarditis" },
    { code: 'A3953', name: "Meningococcal pericarditis" },
    { code: 'A3981', name: "Meningococcal encephalitis" },
    { code: 'A3982', name: "Meningococcal retrobulbar neuritis" },
    { code: 'A3983', name: "Meningococcal arthritis" },
    { code: 'A3984', name: "Postmeningococcal arthritis" },
    { code: 'A3989', name: "Other meningococcal infections" },
    { code: 'A399', name: "Meningococcal infection, unspecified" },
    { code: 'A400', name: "Sepsis due to streptococcus, group A" },
    { code: 'A401', name: "Sepsis due to streptococcus, group B" },
    { code: 'A403', name: "Sepsis due to Streptococcus pneumoniae" },
    { code: 'A408', name: "Other streptococcal sepsis" },
    { code: 'A409', name: "Streptococcal sepsis, unspecified" },
    { code: 'A4101', name: "Sepsis due to Methicillin susceptible Staphylococcus aureus" },
    { code: 'A4102', name: "Sepsis due to Methicillin resistant Staphylococcus aureus" },
    { code: 'A411', name: "Sepsis due to other specified staphylococcus" },
    { code: 'A412', name: "Sepsis due to unspecified staphylococcus" },
    { code: 'A413', name: "Sepsis due to Hemophilus influenzae" },
    { code: 'A414', name: "Sepsis due to anaerobes" },
    { code: 'A4150', name: "Gram-negative sepsis, unspecified" },
    { code: 'A4151', name: "Sepsis due to Escherichia coli [E. coli]" },
    { code: 'A4152', name: "Sepsis due to Pseudomonas" },
    { code: 'A4153', name: "Sepsis due to Serratia" },
    { code: 'A4159', name: "Other Gram-negative sepsis" },
    { code: 'A4181', name: "Sepsis due to Enterococcus" },
    { code: 'A4189', name: "Other specified sepsis" },
    { code: 'A419', name: "Sepsis, unspecified organism" },
    { code: 'A420', name: "Pulmonary actinomycosis" },
    { code: 'A421', name: "Abdominal actinomycosis" },
    { code: 'A422', name: "Cervicofacial actinomycosis" },
    { code: 'A427', name: "Actinomycotic sepsis" },
    { code: 'A4281', name: "Actinomycotic meningitis" },
    { code: 'A4282', name: "Actinomycotic encephalitis" },
    { code: 'A4289', name: "Other forms of actinomycosis" },
    { code: 'A429', name: "Actinomycosis, unspecified" },
    { code: 'A430', name: "Pulmonary nocardiosis" },
    { code: 'A431', name: "Cutaneous nocardiosis" },
    { code: 'A438', name: "Other forms of nocardiosis" },
    { code: 'A439', name: "Nocardiosis, unspecified" },
    { code: 'A440', name: "Systemic bartonellosis" },
    { code: 'A441', name: "Cutaneous and mucocutaneous bartonellosis" },
    { code: 'A448', name: "Other forms of bartonellosis" },
    { code: 'A449', name: "Bartonellosis, unspecified" },
    { code: 'A46', name: " Erysipelas" },
    { code: 'A480', name: "Gas gangrene" },
    { code: 'A481', name: "Legionnaires' disease" },
    { code: 'A482', name: "Nonpneumonic Legionnaires' disease [Pontiac fever]" },
    { code: 'A483', name: "Toxic shock syndrome" },
    { code: 'A484', name: "Brazilian purpuric fever" },
    { code: 'A4851', name: "Infant botulism" },
    { code: 'A4852', name: "Wound botulism" },
    { code: 'A488', name: "Other specified bacterial diseases" },
    { code: 'A4901', name: "Methicillin susceptible Staphylococcus aureus infection, unspecified site" },
    { code: 'A4902', name: "Methicillin resistant Staphylococcus aureus infection, unspecified site" },
    { code: 'A491', name: "Streptococcal infection, unspecified site" },
    { code: 'A492', name: "Hemophilus influenzae infection, unspecified site" },
    { code: 'A493', name: "Mycoplasma infection, unspecified site" },
    { code: 'A498', name: "Other bacterial infections of unspecified site" },
    { code: 'A499', name: "Bacterial infection, unspecified" },
    { code: 'A5001', name: "Early congenital syphilitic oculopathy" },
    { code: 'A5002', name: "Early congenital syphilitic osteochondropathy" },
    { code: 'A5003', name: "Early congenital syphilitic pharyngitis" },
    { code: 'A5004', name: "Early congenital syphilitic pneumonia" },
    { code: 'A5005', name: "Early congenital syphilitic rhinitis" },
    { code: 'A5006', name: "Early cutaneous congenital syphilis" },
    { code: 'A5007', name: "Early mucocutaneous congenital syphilis" },
    { code: 'A5008', name: "Early visceral congenital syphilis" },
    { code: 'A5009', name: "Other early congenital syphilis, symptomatic" },
    { code: 'A501', name: "Early congenital syphilis, latent" },
    { code: 'A502', name: "Early congenital syphilis, unspecified" },
    { code: 'A5030', name: "Late congenital syphilitic oculopathy, unspecified" },
    { code: 'A5031', name: "Late congenital syphilitic interstitial keratitis" },
    { code: 'A5032', name: "Late congenital syphilitic chorioretinitis" },
    { code: 'A5039', name: "Other late congenital syphilitic oculopathy" },
    { code: 'A5040', name: "Late congenital neurosyphilis, unspecified" },
    { code: 'A5041', name: "Late congenital syphilitic meningitis" },
    { code: 'A5042', name: "Late congenital syphilitic encephalitis" },
    { code: 'A5043', name: "Late congenital syphilitic polyneuropathy" },
    { code: 'A5044', name: "Late congenital syphilitic optic nerve atrophy" },
    { code: 'A5045', name: "Juvenile general paresis" },
    { code: 'A5049', name: "Other late congenital neurosyphilis" },
    { code: 'A5051', name: "Clutton's joints" },
    { code: 'A5052', name: "Hutchinson's teeth" },
    { code: 'A5053', name: "Hutchinson's triad" },
    { code: 'A5054', name: "Late congenital cardiovascular syphilis" },
    { code: 'A5055', name: "Late congenital syphilitic arthropathy" },
    { code: 'A5056', name: "Late congenital syphilitic osteochondropathy" },
    { code: 'A5057', name: "Syphilitic saddle nose" },
    { code: 'A5059', name: "Other late congenital syphilis, symptomatic" },
    { code: 'A506', name: "Late congenital syphilis, latent" },
    { code: 'A507', name: "Late congenital syphilis, unspecified" },
    { code: 'A509', name: "Congenital syphilis, unspecified" },
    { code: 'A510', name: "Primary genital syphilis" },
    { code: 'A511', name: "Primary anal syphilis" },
    { code: 'A512', name: "Primary syphilis of other sites" },
    { code: 'A5131', name: "Condyloma latum" },
    { code: 'A5132', name: "Syphilitic alopecia" },
    { code: 'A5139', name: "Other secondary syphilis of skin" },
    { code: 'A5141', name: "Secondary syphilitic meningitis" },
    { code: 'A5142', name: "Secondary syphilitic female pelvic disease" },
    { code: 'A5143', name: "Secondary syphilitic oculopathy" },
    { code: 'A5144', name: "Secondary syphilitic nephritis" },
    { code: 'A5145', name: "Secondary syphilitic hepatitis" },
    { code: 'A5146', name: "Secondary syphilitic osteopathy" },
    { code: 'A5149', name: "Other secondary syphilitic conditions" },
    { code: 'A515', name: "Early syphilis, latent" },
    { code: 'A519', name: "Early syphilis, unspecified" },
    { code: 'A5200', name: "Cardiovascular syphilis, unspecified" },
    { code: 'A5201', name: "Syphilitic aneurysm of aorta" },
    { code: 'A5202', name: "Syphilitic aortitis" },
    { code: 'A5203', name: "Syphilitic endocarditis" },
    { code: 'A5204', name: "Syphilitic cerebral arteritis" },
    { code: 'A5205', name: "Other cerebrovascular syphilis" },
    { code: 'A5206', name: "Other syphilitic heart involvement" },
    { code: 'A5209', name: "Other cardiovascular syphilis" },
    { code: 'A5210', name: "Symptomatic neurosyphilis, unspecified" },
    { code: 'A5211', name: "Tabes dorsalis" },
    { code: 'A5212', name: "Other cerebrospinal syphilis" },
    { code: 'A5213', name: "Late syphilitic meningitis" },
    { code: 'A5214', name: "Late syphilitic encephalitis" },
    { code: 'A5215', name: "Late syphilitic neuropathy" },
    { code: 'A5216', name: "Charcot's arthropathy (tabetic)" },
    { code: 'A5217', name: "General paresis" },
    { code: 'A5219', name: "Other symptomatic neurosyphilis" },
    { code: 'A522', name: "Asymptomatic neurosyphilis" },
    { code: 'A523', name: "Neurosyphilis, unspecified" },
    { code: 'A5271', name: "Late syphilitic oculopathy" },
    { code: 'A5272', name: "Syphilis of lung and bronchus" },
    { code: 'A5273', name: "Symptomatic late syphilis of other respiratory organs" },
    { code: 'A5274', name: "Syphilis of liver and other viscera" },
    { code: 'A5275', name: "Syphilis of kidney and ureter" },
    { code: 'A5276', name: "Other genitourinary symptomatic late syphilis" },
    { code: 'A5277', name: "Syphilis of bone and joint" },
    { code: 'A5278', name: "Syphilis of other musculoskeletal tissue" },
    { code: 'A5279', name: "Other symptomatic late syphilis" },
    { code: 'A528', name: "Late syphilis, latent" },
    { code: 'A529', name: "Late syphilis, unspecified" },
    { code: 'A530', name: "Latent syphilis, unspecified as early or late" },
    { code: 'A539', name: "Syphilis, unspecified" },
    { code: 'A5400', name: "Gonococcal infection of lower genitourinary tract, unspecified" },
    { code: 'A5401', name: "Gonococcal cystitis and urethritis, unspecified" },
    { code: 'A5402', name: "Gonococcal vulvovaginitis, unspecified" },
    { code: 'A5403', name: "Gonococcal cervicitis, unspecified" },
    { code: 'A5409', name: "Other gonococcal infection of lower genitourinary tract" },
    { code: 'A541', name: "Gonococcal infection of lower genitourinary tract with periurethral and accessory gland abscess" },
    { code: 'A5421', name: "Gonococcal infection of kidney and ureter" },
    { code: 'A5422', name: "Gonococcal prostatitis" },
    { code: 'A5423', name: "Gonococcal infection of other male genital organs" },
    { code: 'A5424', name: "Gonococcal female pelvic inflammatory disease" },
    { code: 'A5429', name: "Other gonococcal genitourinary infections" },
    { code: 'A5430', name: "Gonococcal infection of eye, unspecified" },
    { code: 'A5431', name: "Gonococcal conjunctivitis" },
    { code: 'A5432', name: "Gonococcal iridocyclitis" },
    { code: 'A5433', name: "Gonococcal keratitis" },
    { code: 'A5439', name: "Other gonococcal eye infection" },
    { code: 'A5440', name: "Gonococcal infection of musculoskeletal system, unspecified" },
    { code: 'A5441', name: "Gonococcal spondylopathy" },
    { code: 'A5442', name: "Gonococcal arthritis" },
    { code: 'A5443', name: "Gonococcal osteomyelitis" },
    { code: 'A5449', name: "Gonococcal infection of other musculoskeletal tissue" },
    { code: 'A545', name: "Gonococcal pharyngitis" },
    { code: 'A546', name: "Gonococcal infection of anus and rectum" },
    { code: 'A5481', name: "Gonococcal meningitis" },
    { code: 'A5482', name: "Gonococcal brain abscess" },
    { code: 'A5483', name: "Gonococcal heart infection" },
    { code: 'A5484', name: "Gonococcal pneumonia" },
    { code: 'A5485', name: "Gonococcal peritonitis" },
    { code: 'A5486', name: "Gonococcal sepsis" },
    { code: 'A5489', name: "Other gonococcal infections" },
    { code: 'A549', name: "Gonococcal infection, unspecified" },
    { code: 'A55', name: " Chlamydial lymphogranuloma (venereum)" },
    { code: 'A5600', name: "Chlamydial infection of lower genitourinary tract, unspecified" },
    { code: 'A5601', name: "Chlamydial cystitis and urethritis" },
    { code: 'A5602', name: "Chlamydial vulvovaginitis" },
    { code: 'A5609', name: "Other chlamydial infection of lower genitourinary tract" },
    { code: 'A5611', name: "Chlamydial female pelvic inflammatory disease" },
    { code: 'A5619', name: "Other chlamydial genitourinary infection" },
    { code: 'A562', name: "Chlamydial infection of genitourinary tract, unspecified" },
    { code: 'A563', name: "Chlamydial infection of anus and rectum" },
    { code: 'A564', name: "Chlamydial infection of pharynx" },
    { code: 'A568', name: "Sexually transmitted chlamydial infection of other sites" },
    { code: 'A57', name: " Chancroid" },
    { code: 'A58', name: " Granuloma inguinale" },
    { code: 'A5900', name: "Urogenital trichomoniasis, unspecified" },
    { code: 'A5901', name: "Trichomonal vulvovaginitis" },
    { code: 'A5902', name: "Trichomonal prostatitis" },
    { code: 'A5903', name: "Trichomonal cystitis and urethritis" },
    { code: 'A5909', name: "Other urogenital trichomoniasis" },
    { code: 'A598', name: "Trichomoniasis of other sites" },
    { code: 'A599', name: "Trichomoniasis, unspecified" },
    { code: 'A6000', name: "Herpesviral infection of urogenital system, unspecified" },
    { code: 'A6001', name: "Herpesviral infection of penis" },
    { code: 'A6002', name: "Herpesviral infection of other male genital organs" },
    { code: 'A6003', name: "Herpesviral cervicitis" },
    { code: 'A6004', name: "Herpesviral vulvovaginitis" },
    { code: 'A6009', name: "Herpesviral infection of other urogenital tract" },
    { code: 'A601', name: "Herpesviral infection of perianal skin and rectum" },
    { code: 'A609', name: "Anogenital herpesviral infection, unspecified" },
    { code: 'A630', name: "Anogenital (venereal) warts" },
    { code: 'A638', name: "Other specified predominantly sexually transmitted diseases" },
    { code: 'A64', name: "Unspecified sexually transmitted disease" },
    { code: 'A65', name: " Nonvenereal syphilis" },
    { code: 'A660', name: "Initial lesions of yaws" },
    { code: 'A661', name: "Multiple papillomata and wet crab yaws" },
    { code: 'A662', name: "Other early skin lesions of yaws" },
    { code: 'A663', name: "Hyperkeratosis of yaws" },
    { code: 'A664', name: "Gummata and ulcers of yaws" },
    { code: 'A665', name: "Gangosa" },
    { code: 'A666', name: "Bone and joint lesions of yaws" },
    { code: 'A667', name: "Other manifestations of yaws" },
    { code: 'A668', name: "Latent yaws" },
    { code: 'A669', name: "Yaws, unspecified" },
    { code: 'A670', name: "Primary lesions of pinta" },
    { code: 'A671', name: "Intermediate lesions of pinta" },
    { code: 'A672', name: "Late lesions of pinta" },
    { code: 'A673', name: "Mixed lesions of pinta" },
    { code: 'A679', name: "Pinta, unspecified" },
    { code: 'A680', name: "Louse-borne relapsing fever" },
    { code: 'A681', name: "Tick-borne relapsing fever" },
    { code: 'A689', name: "Relapsing fever, unspecified" },
    { code: 'A690', name: "Necrotizing ulcerative stomatitis" },
    { code: 'A691', name: "Other Vincent's infections" },
    { code: 'A6920', name: "Lyme disease, unspecified" },
    { code: 'A6921', name: "Meningitis due to Lyme disease" },
    { code: 'A6922', name: "Other neurologic disorders in Lyme disease" },
    { code: 'A6923', name: "Arthritis due to Lyme disease" },
    { code: 'A6929', name: "Other conditions associated with Lyme disease" },
    { code: 'A698', name: "Other specified spirochetal infections" },
    { code: 'A699', name: "Spirochetal infection, unspecified" },
    { code: 'A70', name: " Chlamydia psittaci infections" },
    { code: 'A710', name: "Initial stage of trachoma" },
    { code: 'A711', name: "Active stage of trachoma" },
    { code: 'A719', name: "Trachoma, unspecified" },
    { code: 'A740', name: "Chlamydial conjunctivitis" },
    { code: 'A7481', name: "Chlamydial peritonitis" },
    { code: 'A7489', name: "Other chlamydial diseases" },
    { code: 'A749', name: "Chlamydial infection, unspecified" },
    { code: 'A750', name: "Epidemic louse-borne typhus fever due to Rickettsia prowazekii" },
    { code: 'A751', name: "Recrudescent typhus [Brill's disease]" },
    { code: 'A752', name: "Typhus fever due to Rickettsia typhi" },
    { code: 'A753', name: "Typhus fever due to Rickettsia tsutsugamushi" },
    { code: 'A759', name: "Typhus fever, unspecified" },
    { code: 'A770', name: "Spotted fever due to Rickettsia rickettsii" },
    { code: 'A771', name: "Spotted fever due to Rickettsia conorii" },
    { code: 'A772', name: "Spotted fever due to Rickettsia siberica" },
    { code: 'A773', name: "Spotted fever due to Rickettsia australis" },
    { code: 'A7740', name: "Ehrlichiosis, unspecified" },
    { code: 'A7741', name: "Ehrlichiosis chafeensis [E. chafeensis]" },
    { code: 'A7749', name: "Other ehrlichiosis" },
    { code: 'A778', name: "Other spotted fevers" },
    { code: 'A779', name: "Spotted fever, unspecified" },
    { code: 'A78', name: " Q fever" },
    { code: 'A790', name: "Trench fever" },
    { code: 'A791', name: "Rickettsialpox due to Rickettsia akari" },
    { code: 'A7981', name: "Rickettsiosis due to Ehrlichia sennetsu" },
    { code: 'A7989', name: "Other specified rickettsioses" },
    { code: 'A799', name: "Rickettsiosis, unspecified" },
    { code: 'A800', name: "Acute paralytic poliomyelitis, vaccine-associated" },
    { code: 'A801', name: "Acute paralytic poliomyelitis, wild virus, imported" },
    { code: 'A802', name: "Acute paralytic poliomyelitis, wild virus, indigenous" },
    { code: 'A8030', name: "Acute paralytic poliomyelitis, unspecified" },
    { code: 'A8039', name: "Other acute paralytic poliomyelitis" },
    { code: 'A804', name: "Acute nonparalytic poliomyelitis" },
    { code: 'A809', name: "Acute poliomyelitis, unspecified" },
    { code: 'A8100', name: "Creutzfeldt-Jakob disease, unspecified" },
    { code: 'A8101', name: "Variant Creutzfeldt-Jakob disease" },
    { code: 'A8109', name: "Other Creutzfeldt-Jakob disease" },
    { code: 'A811', name: "Subacute sclerosing panencephalitis" },
    { code: 'A812', name: "Progressive multifocal leukoencephalopathy" },
    { code: 'A8181', name: "Kuru" },
    { code: 'A8182', name: "Gerstmann-Straussler-Scheinker syndrome" },
    { code: 'A8183', name: "Fatal familial insomnia" },
    { code: 'A8189', name: "Other atypical virus infections of central nervous system" },
    { code: 'A819', name: "Atypical virus infection of central nervous system, unspecified" },
    { code: 'A820', name: "Sylvatic rabies" },
    { code: 'A821', name: "Urban rabies" },
    { code: 'A829', name: "Rabies, unspecified" },
    { code: 'A830', name: "Japanese encephalitis" },
    { code: 'A831', name: "Western equine encephalitis" },
    { code: 'A832', name: "Eastern equine encephalitis" },
    { code: 'A833', name: "St Louis encephalitis" },
    { code: 'A834', name: "Australian encephalitis" },
    { code: 'A835', name: "California encephalitis" },
    { code: 'A836', name: "Rocio virus disease" },
    { code: 'A838', name: "Other mosquito-borne viral encephalitis" },
    { code: 'A839', name: "Mosquito-borne viral encephalitis, unspecified" },
    { code: 'A840', name: "Far Eastern tick-borne encephalitis [Russian spring-summer encephalitis]" },
    { code: 'A841', name: "Central European tick-borne encephalitis" },
    { code: 'A848', name: "Other tick-borne viral encephalitis" },
    { code: 'A849', name: "Tick-borne viral encephalitis, unspecified" },
    { code: 'A850', name: "Enteroviral encephalitis" },
    { code: 'A851', name: "Adenoviral encephalitis" },
    { code: 'A852', name: "Arthropod-borne viral encephalitis, unspecified" },
    { code: 'A858', name: "Other specified viral encephalitis" },
    { code: 'A86', name: "Unspecified viral encephalitis" },
    { code: 'A870', name: "Enteroviral meningitis" },
    { code: 'A871', name: "Adenoviral meningitis" },
    { code: 'A872', name: "Lymphocytic choriomeningitis" },
    { code: 'A878', name: "Other viral meningitis" },
    { code: 'A879', name: "Viral meningitis, unspecified" },
    { code: 'A880', name: "Enteroviral exanthematous fever [Boston exanthem]" },
    { code: 'A881', name: "Epidemic vertigo" },
    { code: 'A888', name: "Other specified viral infections of central nervous system" },
    { code: 'A89', name: "Unspecified viral infection of central nervous system" },
    { code: 'A90', name: " Dengue fever [classical dengue]" },
    { code: 'A91', name: " Dengue hemorrhagic fever" },
    { code: 'A920', name: "Chikungunya virus disease" },
    { code: 'A921', name: "O'nyong-nyong fever" },
    { code: 'A922', name: "Venezuelan equine fever" },
    { code: 'A9230', name: "West Nile virus infection, unspecified" },
    { code: 'A9231', name: "West Nile virus infection with encephalitis" },
    { code: 'A9232', name: "West Nile virus infection with other neurologic manifestation" },
    { code: 'A9239', name: "West Nile virus infection with other complications" },
    { code: 'A924', name: "Rift Valley fever" },
    { code: 'A925', name: "Zika virus disease" },
    { code: 'A928', name: "Other specified mosquito-borne viral fevers" },
    { code: 'A929', name: "Mosquito-borne viral fever, unspecified" },
    { code: 'A930', name: "Oropouche virus disease" },
    { code: 'A931', name: "Sandfly fever" },
    { code: 'A932', name: "Colorado tick fever" },
    { code: 'A938', name: "Other specified arthropod-borne viral fevers" },
    { code: 'A94', name: "Unspecified arthropod-borne viral fever" },
    { code: 'A950', name: "Sylvatic yellow fever" },
    { code: 'A951', name: "Urban yellow fever" },
    { code: 'A959', name: "Yellow fever, unspecified" },
    { code: 'A960', name: "Junin hemorrhagic fever" },
    { code: 'A961', name: "Machupo hemorrhagic fever" },
    { code: 'A962', name: "Lassa fever" },
    { code: 'A968', name: "Other arenaviral hemorrhagic fevers" },
    { code: 'A969', name: "Arenaviral hemorrhagic fever, unspecified" },
    { code: 'A980', name: "Crimean-Congo hemorrhagic fever" },
    { code: 'A981', name: "Omsk hemorrhagic fever" },
    { code: 'A982', name: "Kyasanur Forest disease" },
    { code: 'A983', name: "Marburg virus disease" },
    { code: 'A984', name: "Ebola virus disease" },
    { code: 'A985', name: "Hemorrhagic fever with renal syndrome" },
    { code: 'A988', name: "Other specified viral hemorrhagic fevers" },
    { code: 'A99', name: "Unspecified viral hemorrhagic fever" },
    { code: 'B000', name: "Eczema herpeticum" },
    { code: 'B001', name: "Herpesviral vesicular dermatitis" },
    { code: 'B002', name: "Herpesviral gingivostomatitis and pharyngotonsillitis" },
    { code: 'B003', name: "Herpesviral meningitis" },
    { code: 'B004', name: "Herpesviral encephalitis" },
    { code: 'B0050', name: "Herpesviral ocular disease, unspecified" },
    { code: 'B0051', name: "Herpesviral iridocyclitis" },
    { code: 'B0052', name: "Herpesviral keratitis" },
    { code: 'B0053', name: "Herpesviral conjunctivitis" },
    { code: 'B0059', name: "Other herpesviral disease of eye" },
    { code: 'B007', name: "Disseminated herpesviral disease" },
    { code: 'B0081', name: "Herpesviral hepatitis" },
    { code: 'B0082', name: "Herpes simplex myelitis" },
    { code: 'B0089', name: "Other herpesviral infection" },
    { code: 'B009', name: "Herpesviral infection, unspecified" },
    { code: 'B010', name: "Varicella meningitis" },
    { code: 'B0111', name: "Varicella encephalitis and encephalomyelitis" },
    { code: 'B0112', name: "Varicella myelitis" },
    { code: 'B012', name: "Varicella pneumonia" },
    { code: 'B0181', name: "Varicella keratitis" },
    { code: 'B0189', name: "Other varicella complications" },
    { code: 'B019', name: "Varicella without complication" },
    { code: 'B020', name: "Zoster encephalitis" },
    { code: 'B021', name: "Zoster meningitis" },
    { code: 'B0221', name: "Postherpetic geniculate ganglionitis" },
    { code: 'B0222', name: "Postherpetic trigeminal neuralgia" },
    { code: 'B0223', name: "Postherpetic polyneuropathy" },
    { code: 'B0224', name: "Postherpetic myelitis" },
    { code: 'B0229', name: "Other postherpetic nervous system involvement" },
    { code: 'B0230', name: "Zoster ocular disease, unspecified" },
    { code: 'B0231', name: "Zoster conjunctivitis" },
    { code: 'B0232', name: "Zoster iridocyclitis" },
    { code: 'B0233', name: "Zoster keratitis" },
    { code: 'B0234', name: "Zoster scleritis" },
    { code: 'B0239', name: "Other herpes zoster eye disease" },
    { code: 'B027', name: "Disseminated zoster" },
    { code: 'B028', name: "Zoster with other complications" },
    { code: 'B029', name: "Zoster without complications" },
    { code: 'B03', name: " Smallpox" },
    { code: 'B04', name: " Monkeypox" },
    { code: 'B050', name: "Measles complicated by encephalitis" },
    { code: 'B051', name: "Measles complicated by meningitis" },
    { code: 'B052', name: "Measles complicated by pneumonia" },
    { code: 'B053', name: "Measles complicated by otitis media" },
    { code: 'B054', name: "Measles with intestinal complications" },
    { code: 'B0581', name: "Measles keratitis and keratoconjunctivitis" },
    { code: 'B0589', name: "Other measles complications" },
    { code: 'B059', name: "Measles without complication" },
    { code: 'B0600', name: "Rubella with neurological complication, unspecified" },
    { code: 'B0601', name: "Rubella encephalitis" },
    { code: 'B0602', name: "Rubella meningitis" },
    { code: 'B0609', name: "Other neurological complications of rubella" },
    { code: 'B0681', name: "Rubella pneumonia" },
    { code: 'B0682', name: "Rubella arthritis" },
    { code: 'B0689', name: "Other rubella complications" },
    { code: 'B069', name: "Rubella without complication" },
    { code: 'B070', name: "Plantar wart" },
    { code: 'B078', name: "Other viral warts" },
    { code: 'B079', name: "Viral wart, unspecified" },
    { code: 'B08010', name: "Cowpox" },
    { code: 'B08011', name: "Vaccinia not from vaccine" },
    { code: 'B0802', name: "Orf virus disease" },
    { code: 'B0803', name: "Pseudocowpox [milker's node]" },
    { code: 'B0804', name: "Paravaccinia, unspecified" },
    { code: 'B0809', name: "Other orthopoxvirus infections" },
    { code: 'B081', name: "Molluscum contagiosum" },
    { code: 'B0820', name: "Exanthema subitum [sixth disease], unspecified" },
    { code: 'B0821', name: "Exanthema subitum [sixth disease] due to human herpesvirus 6" },
    { code: 'B0822', name: "Exanthema subitum [sixth disease] due to human herpesvirus 7" },
    { code: 'B083', name: "Erythema infectiosum [fifth disease]" },
    { code: 'B084', name: "Enteroviral vesicular stomatitis with exanthem" },
    { code: 'B085', name: "Enteroviral vesicular pharyngitis" },
    { code: 'B0860', name: "Parapoxvirus infection, unspecified" },
    { code: 'B0861', name: "Bovine stomatitis" },
    { code: 'B0862', name: "Sealpox" },
    { code: 'B0869', name: "Other parapoxvirus infections" },
    { code: 'B0870', name: "Yatapoxvirus infection, unspecified" },
    { code: 'B0871', name: "Tanapox virus disease" },
    { code: 'B0872', name: "Yaba pox virus disease" },
    { code: 'B0879', name: "Other yatapoxvirus infections" },
    { code: 'B088', name: "Other specified viral infections characterized by skin and mucous membrane lesions" },
    { code: 'B09', name: "Unspecified viral infection characterized by skin and mucous membrane lesions" },
    { code: 'B1001', name: "Human herpesvirus 6 encephalitis" },
    { code: 'B1009', name: "Other human herpesvirus encephalitis" },
    { code: 'B1081', name: "Human herpesvirus 6 infection" },
    { code: 'B1082', name: "Human herpesvirus 7 infection" },
    { code: 'B1089', name: "Other human herpesvirus infection" },
    { code: 'B150', name: "Hepatitis A with hepatic coma" },
    { code: 'B159', name: "Hepatitis A without hepatic coma" },
    { code: 'B160', name: "Acute hepatitis B with delta-agent with hepatic coma" },
    { code: 'B161', name: "Acute hepatitis B with delta-agent without hepatic coma" },
    { code: 'B162', name: "Acute hepatitis B without delta-agent with hepatic coma" },
    { code: 'B169', name: "Acute hepatitis B without delta-agent and without hepatic coma" },
    { code: 'B170', name: "Acute delta-(super) infection of hepatitis B carrier" },
    { code: 'B1710', name: "Acute hepatitis C without hepatic coma" },
    { code: 'B1711', name: "Acute hepatitis C with hepatic coma" },
    { code: 'B172', name: "Acute hepatitis E" },
    { code: 'B178', name: "Other specified acute viral hepatitis" },
    { code: 'B179', name: "Acute viral hepatitis, unspecified" },
    { code: 'B180', name: "Chronic viral hepatitis B with delta-agent" },
    { code: 'B181', name: "Chronic viral hepatitis B without delta-agent" },
    { code: 'B182', name: "Chronic viral hepatitis C" },
    { code: 'B188', name: "Other chronic viral hepatitis" },
    { code: 'B189', name: "Chronic viral hepatitis, unspecified" },
    { code: 'B190', name: "Unspecified viral hepatitis with hepatic coma" },
    { code: 'B1910', name: "Unspecified viral hepatitis B without hepatic coma" },
    { code: 'B1911', name: "Unspecified viral hepatitis B with hepatic coma" },
    { code: 'B1920', name: "Unspecified viral hepatitis C without hepatic coma" },
    { code: 'B1921', name: "Unspecified viral hepatitis C with hepatic coma" },
    { code: 'B199', name: "Unspecified viral hepatitis without hepatic coma" },
    { code: 'B20', name: " Human immunodeficiency virus [HIV] disease" },
    { code: 'B250', name: "Cytomegaloviral pneumonitis" },
    { code: 'B251', name: "Cytomegaloviral hepatitis" },
    { code: 'B252', name: "Cytomegaloviral pancreatitis" },
    { code: 'B258', name: "Other cytomegaloviral diseases" },
    { code: 'B259', name: "Cytomegaloviral disease, unspecified" },
    { code: 'B260', name: "Mumps orchitis" },
    { code: 'B261', name: "Mumps meningitis" },
    { code: 'B262', name: "Mumps encephalitis" },
    { code: 'B263', name: "Mumps pancreatitis" },
    { code: 'B2681', name: "Mumps hepatitis" },
    { code: 'B2682', name: "Mumps myocarditis" },
    { code: 'B2683', name: "Mumps nephritis" },
    { code: 'B2684', name: "Mumps polyneuropathy" },
    { code: 'B2685', name: "Mumps arthritis" },
    { code: 'B2689', name: "Other mumps complications" },
    { code: 'B269', name: "Mumps without complication" },
    { code: 'B2700', name: "Gammaherpesviral mononucleosis without complication" },
    { code: 'B2701', name: "Gammaherpesviral mononucleosis with polyneuropathy" },
    { code: 'B2702', name: "Gammaherpesviral mononucleosis with meningitis" },
    { code: 'B2709', name: "Gammaherpesviral mononucleosis with other complications" },
    { code: 'B2710', name: "Cytomegaloviral mononucleosis without complications" },
    { code: 'B2711', name: "Cytomegaloviral mononucleosis with polyneuropathy" },
    { code: 'B2712', name: "Cytomegaloviral mononucleosis with meningitis" },
    { code: 'B2719', name: "Cytomegaloviral mononucleosis with other complication" },
    { code: 'B2780', name: "Other infectious mononucleosis without complication" },
    { code: 'B2781', name: "Other infectious mononucleosis with polyneuropathy" },
    { code: 'B2782', name: "Other infectious mononucleosis with meningitis" },
    { code: 'B2789', name: "Other infectious mononucleosis with other complication" },
    { code: 'B2790', name: "Infectious mononucleosis, unspecified without complication" },
    { code: 'B2791', name: "Infectious mononucleosis, unspecified with polyneuropathy" },
    { code: 'B2792', name: "Infectious mononucleosis, unspecified with meningitis" },
    { code: 'B2799', name: "Infectious mononucleosis, unspecified with other complication" },
    { code: 'B300', name: "Keratoconjunctivitis due to adenovirus" },
    { code: 'B301', name: "Conjunctivitis due to adenovirus" },
    { code: 'B302', name: "Viral pharyngoconjunctivitis" },
    { code: 'B303', name: "Acute epidemic hemorrhagic conjunctivitis (enteroviral)" },
    { code: 'B308', name: "Other viral conjunctivitis" },
    { code: 'B309', name: "Viral conjunctivitis, unspecified" },
    { code: 'B330', name: "Epidemic myalgia" },
    { code: 'B331', name: "Ross River disease" },
    { code: 'B3320', name: "Viral carditis, unspecified" },
    { code: 'B3321', name: "Viral endocarditis" },
    { code: 'B3322', name: "Viral myocarditis" },
    { code: 'B3323', name: "Viral pericarditis" },
    { code: 'B3324', name: "Viral cardiomyopathy" },
    { code: 'B333', name: "Retrovirus infections, not elsewhere classified" },
    { code: 'B334', name: "Hantavirus (cardio)-pulmonary syndrome [HPS] [HCPS]" },
    { code: 'B338', name: "Other specified viral diseases" },
    { code: 'B340', name: "Adenovirus infection, unspecified" },
    { code: 'B341', name: "Enterovirus infection, unspecified" },
    { code: 'B342', name: "Coronavirus infection, unspecified" },
    { code: 'B343', name: "Parvovirus infection, unspecified" },
    { code: 'B344', name: "Papovavirus infection, unspecified" },
    { code: 'B348', name: "Other viral infections of unspecified site" },
    { code: 'B349', name: "Viral infection, unspecified" },
    { code: 'B350', name: "Tinea barbae and tinea capitis" },
    { code: 'B351', name: "Tinea unguium" },
    { code: 'B352', name: "Tinea manuum" },
    { code: 'B353', name: "Tinea pedis" },
    { code: 'B354', name: "Tinea corporis" },
    { code: 'B355', name: "Tinea imbricata" },
    { code: 'B356', name: "Tinea cruris" },
    { code: 'B358', name: "Other dermatophytoses" },
    { code: 'B359', name: "Dermatophytosis, unspecified" },
    { code: 'B360', name: "Pityriasis versicolor" },
    { code: 'B361', name: "Tinea nigra" },
    { code: 'B362', name: "White piedra" },
    { code: 'B363', name: "Black piedra" },
    { code: 'B368', name: "Other specified superficial mycoses" },
    { code: 'B369', name: "Superficial mycosis, unspecified" },
    { code: 'B370', name: "Candidal stomatitis" },
    { code: 'B371', name: "Pulmonary candidiasis" },
    { code: 'B372', name: "Candidiasis of skin and nail" },
    { code: 'B373', name: "Candidiasis of vulva and vagina" },
    { code: 'B3741', name: "Candidal cystitis and urethritis" },
    { code: 'B3742', name: "Candidal balanitis" },
    { code: 'B3749', name: "Other urogenital candidiasis" },
    { code: 'B375', name: "Candidal meningitis" },
    { code: 'B376', name: "Candidal endocarditis" },
    { code: 'B377', name: "Candidal sepsis" },
    { code: 'B3781', name: "Candidal esophagitis" },
    { code: 'B3782', name: "Candidal enteritis" },
    { code: 'B3783', name: "Candidal cheilitis" },
    { code: 'B3784', name: "Candidal otitis externa" },
    { code: 'B3789', name: "Other sites of candidiasis" },
    { code: 'B379', name: "Candidiasis, unspecified" },
    { code: 'B380', name: "Acute pulmonary coccidioidomycosis" },
    { code: 'B381', name: "Chronic pulmonary coccidioidomycosis" },
    { code: 'B382', name: "Pulmonary coccidioidomycosis, unspecified" },
    { code: 'B383', name: "Cutaneous coccidioidomycosis" },
    { code: 'B384', name: "Coccidioidomycosis meningitis" },
    { code: 'B387', name: "Disseminated coccidioidomycosis" },
    { code: 'B3881', name: "Prostatic coccidioidomycosis" },
    { code: 'B3889', name: "Other forms of coccidioidomycosis" },
    { code: 'B389', name: "Coccidioidomycosis, unspecified" },
    { code: 'B390', name: "Acute pulmonary histoplasmosis capsulati" },
    { code: 'B391', name: "Chronic pulmonary histoplasmosis capsulati" },
    { code: 'B392', name: "Pulmonary histoplasmosis capsulati, unspecified" },
    { code: 'B393', name: "Disseminated histoplasmosis capsulati" },
    { code: 'B394', name: "Histoplasmosis capsulati, unspecified" },
    { code: 'B395', name: "Histoplasmosis duboisii" },
    { code: 'B399', name: "Histoplasmosis, unspecified" },
    { code: 'B400', name: "Acute pulmonary blastomycosis" },
    { code: 'B401', name: "Chronic pulmonary blastomycosis" },
    { code: 'B402', name: "Pulmonary blastomycosis, unspecified" },
    { code: 'B403', name: "Cutaneous blastomycosis" },
    { code: 'B407', name: "Disseminated blastomycosis" },
    { code: 'B4081', name: "Blastomycotic meningoencephalitis" },
    { code: 'B4089', name: "Other forms of blastomycosis" },
    { code: 'B409', name: "Blastomycosis, unspecified" },
    { code: 'B410', name: "Pulmonary paracoccidioidomycosis" },
    { code: 'B417', name: "Disseminated paracoccidioidomycosis" },
    { code: 'B418', name: "Other forms of paracoccidioidomycosis" },
    { code: 'B419', name: "Paracoccidioidomycosis, unspecified" },
    { code: 'B420', name: "Pulmonary sporotrichosis" },
    { code: 'B421', name: "Lymphocutaneous sporotrichosis" },
    { code: 'B427', name: "Disseminated sporotrichosis" },
    { code: 'B4281', name: "Cerebral sporotrichosis" },
    { code: 'B4282', name: "Sporotrichosis arthritis" },
    { code: 'B4289', name: "Other forms of sporotrichosis" },
    { code: 'B429', name: "Sporotrichosis, unspecified" },
    { code: 'B430', name: "Cutaneous chromomycosis" },
    { code: 'B431', name: "Pheomycotic brain abscess" },
    { code: 'B432', name: "Subcutaneous pheomycotic abscess and cyst" },
    { code: 'B438', name: "Other forms of chromomycosis" },
    { code: 'B439', name: "Chromomycosis, unspecified" },
    { code: 'B440', name: "Invasive pulmonary aspergillosis" },
    { code: 'B441', name: "Other pulmonary aspergillosis" },
    { code: 'B442', name: "Tonsillar aspergillosis" },
    { code: 'B447', name: "Disseminated aspergillosis" },
    { code: 'B4481', name: "Allergic bronchopulmonary aspergillosis" },
    { code: 'B4489', name: "Other forms of aspergillosis" },
    { code: 'B449', name: "Aspergillosis, unspecified" },
    { code: 'B450', name: "Pulmonary cryptococcosis" },
    { code: 'B451', name: "Cerebral cryptococcosis" },
    { code: 'B452', name: "Cutaneous cryptococcosis" },
    { code: 'B453', name: "Osseous cryptococcosis" },
    { code: 'B457', name: "Disseminated cryptococcosis" },
    { code: 'B458', name: "Other forms of cryptococcosis" },
    { code: 'B459', name: "Cryptococcosis, unspecified" },
    { code: 'B460', name: "Pulmonary mucormycosis" },
    { code: 'B461', name: "Rhinocerebral mucormycosis" },
    { code: 'B462', name: "Gastrointestinal mucormycosis" },
    { code: 'B463', name: "Cutaneous mucormycosis" },
    { code: 'B464', name: "Disseminated mucormycosis" },
    { code: 'B465', name: "Mucormycosis, unspecified" },
    { code: 'B468', name: "Other zygomycoses" },
    { code: 'B469', name: "Zygomycosis, unspecified" },
    { code: 'B470', name: "Eumycetoma" },
    { code: 'B471', name: "Actinomycetoma" },
    { code: 'B479', name: "Mycetoma, unspecified" },
    { code: 'B480', name: "Lobomycosis" },
    { code: 'B481', name: "Rhinosporidiosis" },
    { code: 'B482', name: "Allescheriasis" },
    { code: 'B483', name: "Geotrichosis" },
    { code: 'B484', name: "Penicillosis" },
    { code: 'B488', name: "Other specified mycoses" },
    { code: 'B49', name: "Unspecified mycosis" },
    { code: 'B500', name: "Plasmodium falciparum malaria with cerebral complications" },
    { code: 'B508', name: "Other severe and complicated Plasmodium falciparum malaria" },
    { code: 'B509', name: "Plasmodium falciparum malaria, unspecified" },
    { code: 'B510', name: "Plasmodium vivax malaria with rupture of spleen" },
    { code: 'B518', name: "Plasmodium vivax malaria with other complications" },
    { code: 'B519', name: "Plasmodium vivax malaria without complication" },
    { code: 'B520', name: "Plasmodium malariae malaria with nephropathy" },
    { code: 'B528', name: "Plasmodium malariae malaria with other complications" },
    { code: 'B529', name: "Plasmodium malariae malaria without complication" },
    { code: 'B530', name: "Plasmodium ovale malaria" },
    { code: 'B531', name: "Malaria due to simian plasmodia" },
    { code: 'B538', name: "Other malaria, not elsewhere classified" },
    { code: 'B54', name: "Unspecified malaria" },
    { code: 'B550', name: "Visceral leishmaniasis" },
    { code: 'B551', name: "Cutaneous leishmaniasis" },
    { code: 'B552', name: "Mucocutaneous leishmaniasis" },
    { code: 'B559', name: "Leishmaniasis, unspecified" },
    { code: 'B560', name: "Gambiense trypanosomiasis" },
    { code: 'B561', name: "Rhodesiense trypanosomiasis" },
    { code: 'B569', name: "African trypanosomiasis, unspecified" },
    { code: 'B570', name: "Acute Chagas' disease with heart involvement" },
    { code: 'B571', name: "Acute Chagas' disease without heart involvement" },
    { code: 'B572', name: "Chagas' disease (chronic) with heart involvement" },
    { code: 'B5730', name: "Chagas' disease with digestive system involvement, unspecified" },
    { code: 'B5731', name: "Megaesophagus in Chagas' disease" },
    { code: 'B5732', name: "Megacolon in Chagas' disease" },
    { code: 'B5739', name: "Other digestive system involvement in Chagas' disease" },
    { code: 'B5740', name: "Chagas' disease with nervous system involvement, unspecified" },
    { code: 'B5741', name: "Meningitis in Chagas' disease" },
    { code: 'B5742', name: "Meningoencephalitis in Chagas' disease" },
    { code: 'B5749', name: "Other nervous system involvement in Chagas' disease" },
    { code: 'B575', name: "Chagas' disease (chronic) with other organ involvement" },
    { code: 'B5800', name: "Toxoplasma oculopathy, unspecified" },
    { code: 'B5801', name: "Toxoplasma chorioretinitis" },
    { code: 'B5809', name: "Other toxoplasma oculopathy" },
    { code: 'B581', name: "Toxoplasma hepatitis" },
    { code: 'B582', name: "Toxoplasma meningoencephalitis" },
    { code: 'B583', name: "Pulmonary toxoplasmosis" },
    { code: 'B5881', name: "Toxoplasma myocarditis" },
    { code: 'B5882', name: "Toxoplasma myositis" },
    { code: 'B5883', name: "Toxoplasma tubulo-interstitial nephropathy" },
    { code: 'B5889', name: "Toxoplasmosis with other organ involvement" },
    { code: 'B589', name: "Toxoplasmosis, unspecified" },
    { code: 'B59', name: " Pneumocystosis" },
    { code: 'B600', name: "Babesiosis" },
    { code: 'B6010', name: "Acanthamebiasis, unspecified" },
    { code: 'B6011', name: "Meningoencephalitis due to Acanthamoeba (culbertsoni)" },
    { code: 'B6012', name: "Conjunctivitis due to Acanthamoeba" },
    { code: 'B6013', name: "Keratoconjunctivitis due to Acanthamoeba" },
    { code: 'B6019', name: "Other acanthamebic disease" },
    { code: 'B602', name: "Naegleriasis" },
    { code: 'B608', name: "Other specified protozoal diseases" },
    { code: 'B64', name: "Unspecified protozoal disease" },
    { code: 'B650', name: "Schistosomiasis due to Schistosoma haematobium [urinary schistosomiasis]" },
    { code: 'B651', name: "Schistosomiasis due to Schistosoma mansoni [intestinal schistosomiasis]" },
    { code: 'B652', name: "Schistosomiasis due to Schistosoma japonicum" },
    { code: 'B653', name: "Cercarial dermatitis" },
    { code: 'B658', name: "Other schistosomiasis" },
    { code: 'B659', name: "Schistosomiasis, unspecified" },
    { code: 'B660', name: "Opisthorchiasis" },
    { code: 'B661', name: "Clonorchiasis" },
    { code: 'B662', name: "Dicroceliasis" },
    { code: 'B663', name: "Fascioliasis" },
    { code: 'B664', name: "Paragonimiasis" },
    { code: 'B665', name: "Fasciolopsiasis" },
    { code: 'B668', name: "Other specified fluke infections" },
    { code: 'B669', name: "Fluke infection, unspecified" },
    { code: 'B670', name: "Echinococcus granulosus infection of liver" },
    { code: 'B671', name: "Echinococcus granulosus infection of lung" },
    { code: 'B672', name: "Echinococcus granulosus infection of bone" },
    { code: 'B6731', name: "Echinococcus granulosus infection, thyroid gland" },
    { code: 'B6732', name: "Echinococcus granulosus infection, multiple sites" },
    { code: 'B6739', name: "Echinococcus granulosus infection, other sites" },
    { code: 'B674', name: "Echinococcus granulosus infection, unspecified" },
    { code: 'B675', name: "Echinococcus multilocularis infection of liver" },
    { code: 'B6761', name: "Echinococcus multilocularis infection, multiple sites" },
    { code: 'B6769', name: "Echinococcus multilocularis infection, other sites" },
    { code: 'B677', name: "Echinococcus multilocularis infection, unspecified" },
    { code: 'B678', name: "Echinococcosis, unspecified, of liver" },
    { code: 'B6790', name: "Echinococcosis, unspecified" },
    { code: 'B6799', name: "Other echinococcosis" },
    { code: 'B680', name: "Taenia solium taeniasis" },
    { code: 'B681', name: "Taenia saginata taeniasis" },
    { code: 'B689', name: "Taeniasis, unspecified" },
    { code: 'B690', name: "Cysticercosis of central nervous system" },
    { code: 'B691', name: "Cysticercosis of eye" },
    { code: 'B6981', name: "Myositis in cysticercosis" },
    { code: 'B6989', name: "Cysticercosis of other sites" },
    { code: 'B699', name: "Cysticercosis, unspecified" },
    { code: 'B700', name: "Diphyllobothriasis" },
    { code: 'B701', name: "Sparganosis" },
    { code: 'B710', name: "Hymenolepiasis" },
    { code: 'B711', name: "Dipylidiasis" },
    { code: 'B718', name: "Other specified cestode infections" },
    { code: 'B719', name: "Cestode infection, unspecified" },
    { code: 'B72', name: " Dracunculiasis" },
    { code: 'B7300', name: "Onchocerciasis with eye involvement, unspecified" },
    { code: 'B7301', name: "Onchocerciasis with endophthalmitis" },
    { code: 'B7302', name: "Onchocerciasis with glaucoma" },
    { code: 'B7309', name: "Onchocerciasis with other eye involvement" },
    { code: 'B731', name: "Onchocerciasis without eye disease" },
    { code: 'B740', name: "Filariasis due to Wuchereria bancrofti" },
    { code: 'B741', name: "Filariasis due to Brugia malayi" },
    { code: 'B742', name: "Filariasis due to Brugia timori" },
    { code: 'B743', name: "Loiasis" },
    { code: 'B744', name: "Mansonelliasis" },
    { code: 'B748', name: "Other filariases" },
    { code: 'B749', name: "Filariasis, unspecified" },
    { code: 'B75', name: " Trichinellosis" },
    { code: 'B760', name: "Ancylostomiasis" },
    { code: 'B761', name: "Necatoriasis" },
    { code: 'B768', name: "Other hookworm diseases" },
    { code: 'B769', name: "Hookworm disease, unspecified" },
    { code: 'B770', name: "Ascariasis with intestinal complications" },
    { code: 'B7781', name: "Ascariasis pneumonia" },
    { code: 'B7789', name: "Ascariasis with other complications" },
    { code: 'B779', name: "Ascariasis, unspecified" },
    { code: 'B780', name: "Intestinal strongyloidiasis" },
    { code: 'B781', name: "Cutaneous strongyloidiasis" },
    { code: 'B787', name: "Disseminated strongyloidiasis" },
    { code: 'B789', name: "Strongyloidiasis, unspecified" },
    { code: 'B79', name: " Trichuriasis" },
    { code: 'B80', name: " Enterobiasis" },
    { code: 'B810', name: "Anisakiasis" },
    { code: 'B811', name: "Intestinal capillariasis" },
    { code: 'B812', name: "Trichostrongyliasis" },
    { code: 'B813', name: "Intestinal angiostrongyliasis" },
    { code: 'B814', name: "Mixed intestinal helminthiases" },
    { code: 'B818', name: "Other specified intestinal helminthiases" },
    { code: 'B820', name: "Intestinal helminthiasis, unspecified" },
    { code: 'B829', name: "Intestinal parasitism, unspecified" },
    { code: 'B830', name: "Visceral larva migrans" },
    { code: 'B831', name: "Gnathostomiasis" },
    { code: 'B832', name: "Angiostrongyliasis due to Parastrongylus cantonensis" },
    { code: 'B833', name: "Syngamiasis" },
    { code: 'B834', name: "Internal hirudiniasis" },
    { code: 'B838', name: "Other specified helminthiases" },
    { code: 'B839', name: "Helminthiasis, unspecified" },
    { code: 'B850', name: "Pediculosis due to Pediculus humanus capitis" },
    { code: 'B851', name: "Pediculosis due to Pediculus humanus corporis" },
    { code: 'B852', name: "Pediculosis, unspecified" },
    { code: 'B853', name: "Phthiriasis" },
    { code: 'B854', name: "Mixed pediculosis and phthiriasis" },
    { code: 'B86', name: " Scabies" },
    { code: 'B870', name: "Cutaneous myiasis" },
    { code: 'B871', name: "Wound myiasis" },
    { code: 'B872', name: "Ocular myiasis" },
    { code: 'B873', name: "Nasopharyngeal myiasis" },
    { code: 'B874', name: "Aural myiasis" },
    { code: 'B8781', name: "Genitourinary myiasis" },
    { code: 'B8782', name: "Intestinal myiasis" },
    { code: 'B8789', name: "Myiasis of other sites" },
    { code: 'B879', name: "Myiasis, unspecified" },
    { code: 'B880', name: "Other acariasis" },
    { code: 'B881', name: "Tungiasis [sandflea infestation]" },
    { code: 'B882', name: "Other arthropod infestations" },
    { code: 'B883', name: "External hirudiniasis" },
    { code: 'B888', name: "Other specified infestations" },
    { code: 'B889', name: "Infestation, unspecified" },
    { code: 'B89', name: "Unspecified parasitic disease" },
    { code: 'B900', name: "Sequelae of central nervous system tuberculosis" },
    { code: 'B901', name: "Sequelae of genitourinary tuberculosis" },
    { code: 'B902', name: "Sequelae of tuberculosis of bones and joints" },
    { code: 'B908', name: "Sequelae of tuberculosis of other organs" },
    { code: 'B909', name: "Sequelae of respiratory and unspecified tuberculosis" },
    { code: 'B91', name: " Sequelae of poliomyelitis" },
    { code: 'B92', name: " Sequelae of leprosy" },
    { code: 'B940', name: "Sequelae of trachoma" },
    { code: 'B941', name: "Sequelae of viral encephalitis" },
    { code: 'B942', name: "Sequelae of viral hepatitis" },
    { code: 'B948', name: "Sequelae of other specified infectious and parasitic diseases" },
    { code: 'B949', name: "Sequelae of unspecified infectious and parasitic disease" },
    { code: 'B950', name: "Streptococcus, group A, as the cause of diseases classified elsewhere" },
    { code: 'B951', name: "Streptococcus, group B, as the cause of diseases classified elsewhere" },
    { code: 'B952', name: "Enterococcus as the cause of diseases classified elsewhere" },
    { code: 'B953', name: "Streptococcus pneumoniae as the cause of diseases classified elsewhere" },
    { code: 'B954', name: "Other streptococcus as the cause of diseases classified elsewhere" },
    { code: 'B955', name: "Unspecified streptococcus as the cause of diseases classified elsewhere" },
    { code: 'B9561', name: "Methicillin susceptible Staphylococcus aureus infection as the cause of diseases classified elsewhere" },
    { code: 'B9562', name: "Methicillin resistant Staphylococcus aureus infection as the cause of diseases classified elsewhere" },
    { code: 'B957', name: "Other staphylococcus as the cause of diseases classified elsewhere" },
    { code: 'B958', name: "Unspecified staphylococcus as the cause of diseases classified elsewhere" },
    { code: 'B960', name: "Mycoplasma pneumoniae [M. pneumoniae] as the cause of diseases classified elsewhere" },
    { code: 'B961', name: "Klebsiella pneumoniae [K. pneumoniae] as the cause of diseases classified elsewhere" },
    { code: 'B9620', name: "Unspecified Escherichia coli [E. coli] as the cause of diseases classified elsewhere" },
    { code: 'B9621', name: "Shiga toxin-producing Escherichia coli [E. coli] (STEC) O157 as the cause of diseases classified elsewhere" },
    { code: 'B9622', name: "Other specified Shiga toxin-producing Escherichia coli [E. coli] (STEC) as the cause of diseases classified elsewhere" },
    { code: 'B9623', name: "Unspecified Shiga toxin-producing Escherichia coli [E. coli] (STEC) as the cause of diseases classified elsewhere" },
    { code: 'B9629', name: "Other Escherichia coli [E. coli] as the cause of diseases classified elsewhere" },
    { code: 'B963', name: "Hemophilus influenzae [H. influenzae] as the cause of diseases classified elsewhere" },
    { code: 'B964', name: "Proteus (mirabilis) (morganii) as the cause of diseases classified elsewhere" },
    { code: 'B965', name: "Pseudomonas (aeruginosa) (mallei) (pseudomallei) as the cause of diseases classified elsewhere" },
    { code: 'B966', name: "Bacteroides fragilis [B. fragilis] as the cause of diseases classified elsewhere" },
    { code: 'B967', name: "Clostridium perfringens [C. perfringens] as the cause of diseases classified elsewhere" },
    { code: 'B9681', name: "Helicobacter pylori [H. pylori] as the cause of diseases classified elsewhere" },
    { code: 'B9682', name: "Vibrio vulnificus as the cause of diseases classified elsewhere" },
    { code: 'B9689', name: "Other specified bacterial agents as the cause of diseases classified elsewhere" },
    { code: 'B970', name: "Adenovirus as the cause of diseases classified elsewhere" },
    { code: 'B9710', name: "Unspecified enterovirus as the cause of diseases classified elsewhere" },
    { code: 'B9711', name: "Coxsackievirus as the cause of diseases classified elsewhere" },
    { code: 'B9712', name: "Echovirus as the cause of diseases classified elsewhere" },
    { code: 'B9719', name: "Other enterovirus as the cause of diseases classified elsewhere" },
    { code: 'B9721', name: "SARS-associated coronavirus as the cause of diseases classified elsewhere" },
    { code: 'B9729', name: "Other coronavirus as the cause of diseases classified elsewhere" },
    { code: 'B9730', name: "Unspecified retrovirus as the cause of diseases classified elsewhere" },
    { code: 'B9731', name: "Lentivirus as the cause of diseases classified elsewhere" },
    { code: 'B9732', name: "Oncovirus as the cause of diseases classified elsewhere" },
    { code: 'B9733', name: "Human T-cell lymphotrophic virus, type I [HTLV-I] as the cause of diseases classified elsewhere" },
    { code: 'B9734', name: "Human T-cell lymphotrophic virus, type II [HTLV-II] as the cause of diseases classified elsewhere" },
    { code: 'B9735', name: "Human immunodeficiency virus, type 2 [HIV 2] as the cause of diseases classified elsewhere" },
    { code: 'B9739', name: "Other retrovirus as the cause of diseases classified elsewhere" },
    { code: 'B974', name: "Respiratory syncytial virus as the cause of diseases classified elsewhere" },
    { code: 'B975', name: "Reovirus as the cause of diseases classified elsewhere" },
    { code: 'B976', name: "Parvovirus as the cause of diseases classified elsewhere" },
    { code: 'B977', name: "Papillomavirus as the cause of diseases classified elsewhere" },
    { code: 'B9781', name: "Human metapneumovirus as the cause of diseases classified elsewhere" },
    { code: 'B9789', name: "Other viral agents as the cause of diseases classified elsewhere" },
    { code: 'B998', name: "Other infectious disease" },
    { code: 'B999', name: "Unspecified infectious disease" },
    { code: 'C000', name: "Malignant neoplasm of external upper lip" },
    { code: 'C001', name: "Malignant neoplasm of external lower lip" },
    { code: 'C002', name: "Malignant neoplasm of external lip, unspecified" },
    { code: 'C003', name: "Malignant neoplasm of upper lip, inner aspect" },
    { code: 'C004', name: "Malignant neoplasm of lower lip, inner aspect" },
    { code: 'C005', name: "Malignant neoplasm of lip, unspecified, inner aspect" },
    { code: 'C006', name: "Malignant neoplasm of commissure of lip, unspecified" },
    { code: 'C008', name: "Malignant neoplasm of overlapping sites of lip" },
    { code: 'C009', name: "Malignant neoplasm of lip, unspecified" },
    { code: 'C01', name: " Malignant neoplasm of base of tongue" },
    { code: 'C020', name: "Malignant neoplasm of dorsal surface of tongue" },
    { code: 'C021', name: "Malignant neoplasm of border of tongue" },
    { code: 'C022', name: "Malignant neoplasm of ventral surface of tongue" },
    { code: 'C023', name: "Malignant neoplasm of anterior two-thirds of tongue, part unspecified" },
    { code: 'C024', name: "Malignant neoplasm of lingual tonsil" },
    { code: 'C028', name: "Malignant neoplasm of overlapping sites of tongue" },
    { code: 'C029', name: "Malignant neoplasm of tongue, unspecified" },
    { code: 'C030', name: "Malignant neoplasm of upper gum" },
    { code: 'C031', name: "Malignant neoplasm of lower gum" },
    { code: 'C039', name: "Malignant neoplasm of gum, unspecified" },
    { code: 'C040', name: "Malignant neoplasm of anterior floor of mouth" },
    { code: 'C041', name: "Malignant neoplasm of lateral floor of mouth" },
    { code: 'C048', name: "Malignant neoplasm of overlapping sites of floor of mouth" },
    { code: 'C049', name: "Malignant neoplasm of floor of mouth, unspecified" },
    { code: 'C050', name: "Malignant neoplasm of hard palate" },
    { code: 'C051', name: "Malignant neoplasm of soft palate" },
    { code: 'C052', name: "Malignant neoplasm of uvula" },
    { code: 'C058', name: "Malignant neoplasm of overlapping sites of palate" },
    { code: 'C059', name: "Malignant neoplasm of palate, unspecified" },
    { code: 'C060', name: "Malignant neoplasm of cheek mucosa" },
    { code: 'C061', name: "Malignant neoplasm of vestibule of mouth" },
    { code: 'C062', name: "Malignant neoplasm of retromolar area" },
    { code: 'C0680', name: "Malignant neoplasm of overlapping sites of unspecified parts of mouth" },
    { code: 'C0689', name: "Malignant neoplasm of overlapping sites of other parts of mouth" },
    { code: 'C069', name: "Malignant neoplasm of mouth, unspecified" },
    { code: 'C07', name: " Malignant neoplasm of parotid gland" },
    { code: 'C080', name: "Malignant neoplasm of submandibular gland" },
    { code: 'C081', name: "Malignant neoplasm of sublingual gland" },
    { code: 'C089', name: "Malignant neoplasm of major salivary gland, unspecified" },
    { code: 'C090', name: "Malignant neoplasm of tonsillar fossa" },
    { code: 'C091', name: "Malignant neoplasm of tonsillar pillar (anterior) (posterior)" },
    { code: 'C098', name: "Malignant neoplasm of overlapping sites of tonsil" },
    { code: 'C099', name: "Malignant neoplasm of tonsil, unspecified" },
    { code: 'C100', name: "Malignant neoplasm of vallecula" },
    { code: 'C101', name: "Malignant neoplasm of anterior surface of epiglottis" },
    { code: 'C102', name: "Malignant neoplasm of lateral wall of oropharynx" },
    { code: 'C103', name: "Malignant neoplasm of posterior wall of oropharynx" },
    { code: 'C104', name: "Malignant neoplasm of branchial cleft" },
    { code: 'C108', name: "Malignant neoplasm of overlapping sites of oropharynx" },
    { code: 'C109', name: "Malignant neoplasm of oropharynx, unspecified" },
    { code: 'C110', name: "Malignant neoplasm of superior wall of nasopharynx" },
    { code: 'C111', name: "Malignant neoplasm of posterior wall of nasopharynx" },
    { code: 'C112', name: "Malignant neoplasm of lateral wall of nasopharynx" },
    { code: 'C113', name: "Malignant neoplasm of anterior wall of nasopharynx" },
    { code: 'C118', name: "Malignant neoplasm of overlapping sites of nasopharynx" },
    { code: 'C119', name: "Malignant neoplasm of nasopharynx, unspecified" },
    { code: 'C12', name: " Malignant neoplasm of pyriform sinus" },
    { code: 'C130', name: "Malignant neoplasm of postcricoid region" },
    { code: 'C131', name: "Malignant neoplasm of aryepiglottic fold, hypopharyngeal aspect" },
    { code: 'C132', name: "Malignant neoplasm of posterior wall of hypopharynx" },
    { code: 'C138', name: "Malignant neoplasm of overlapping sites of hypopharynx" },
    { code: 'C139', name: "Malignant neoplasm of hypopharynx, unspecified" },
    { code: 'C140', name: "Malignant neoplasm of pharynx, unspecified" },
    { code: 'C142', name: "Malignant neoplasm of Waldeyer's ring" },
    { code: 'C148', name: "Malignant neoplasm of overlapping sites of lip, oral cavity and pharynx" },
    { code: 'C153', name: "Malignant neoplasm of upper third of esophagus" },
    { code: 'C154', name: "Malignant neoplasm of middle third of esophagus" },
    { code: 'C155', name: "Malignant neoplasm of lower third of esophagus" },
    { code: 'C158', name: "Malignant neoplasm of overlapping sites of esophagus" },
    { code: 'C159', name: "Malignant neoplasm of esophagus, unspecified" },
    { code: 'C160', name: "Malignant neoplasm of cardia" },
    { code: 'C161', name: "Malignant neoplasm of fundus of stomach" },
    { code: 'C162', name: "Malignant neoplasm of body of stomach" },
    { code: 'C163', name: "Malignant neoplasm of pyloric antrum" },
    { code: 'C164', name: "Malignant neoplasm of pylorus" },
    { code: 'C165', name: "Malignant neoplasm of lesser curvature of stomach, unspecified" },
    { code: 'C166', name: "Malignant neoplasm of greater curvature of stomach, unspecified" },
    { code: 'C168', name: "Malignant neoplasm of overlapping sites of stomach" },
    { code: 'C169', name: "Malignant neoplasm of stomach, unspecified" },
    { code: 'C170', name: "Malignant neoplasm of duodenum" },
    { code: 'C171', name: "Malignant neoplasm of jejunum" },
    { code: 'C172', name: "Malignant neoplasm of ileum" },
    { code: 'C173', name: "Meckel's diverticulum, malignant" },
    { code: 'C178', name: "Malignant neoplasm of overlapping sites of small intestine" },
    { code: 'C179', name: "Malignant neoplasm of small intestine, unspecified" },
    { code: 'C180', name: "Malignant neoplasm of cecum" },
    { code: 'C181', name: "Malignant neoplasm of appendix" },
    { code: 'C182', name: "Malignant neoplasm of ascending colon" },
    { code: 'C183', name: "Malignant neoplasm of hepatic flexure" },
    { code: 'C184', name: "Malignant neoplasm of transverse colon" },
    { code: 'C185', name: "Malignant neoplasm of splenic flexure" },
    { code: 'C186', name: "Malignant neoplasm of descending colon" },
    { code: 'C187', name: "Malignant neoplasm of sigmoid colon" },
    { code: 'C188', name: "Malignant neoplasm of overlapping sites of colon" },
    { code: 'C189', name: "Malignant neoplasm of colon, unspecified" },
    { code: 'C19', name: " Malignant neoplasm of rectosigmoid junction" },
    { code: 'C20', name: " Malignant neoplasm of rectum" },
    { code: 'C210', name: "Malignant neoplasm of anus, unspecified" },
    { code: 'C211', name: "Malignant neoplasm of anal canal" },
    { code: 'C212', name: "Malignant neoplasm of cloacogenic zone" },
    { code: 'C218', name: "Malignant neoplasm of overlapping sites of rectum, anus and anal canal" },
    { code: 'C220', name: "Liver cell carcinoma" },
    { code: 'C221', name: "Intrahepatic bile duct carcinoma" },
    { code: 'C222', name: "Hepatoblastoma" },
    { code: 'C223', name: "Angiosarcoma of liver" },
    { code: 'C224', name: "Other sarcomas of liver" },
    { code: 'C227', name: "Other specified carcinomas of liver" },
    { code: 'C228', name: "Malignant neoplasm of liver, primary, unspecified as to type" },
    { code: 'C229', name: "Malignant neoplasm of liver, not specified as primary or secondary" },
    { code: 'C23', name: " Malignant neoplasm of gallbladder" },
    { code: 'C240', name: "Malignant neoplasm of extrahepatic bile duct" },
    { code: 'C241', name: "Malignant neoplasm of ampulla of Vater" },
    { code: 'C248', name: "Malignant neoplasm of overlapping sites of biliary tract" },
    { code: 'C249', name: "Malignant neoplasm of biliary tract, unspecified" },
    { code: 'C250', name: "Malignant neoplasm of head of pancreas" },
    { code: 'C251', name: "Malignant neoplasm of body of pancreas" },
    { code: 'C252', name: "Malignant neoplasm of tail of pancreas" },
    { code: 'C253', name: "Malignant neoplasm of pancreatic duct" },
    { code: 'C254', name: "Malignant neoplasm of endocrine pancreas" },
    { code: 'C257', name: "Malignant neoplasm of other parts of pancreas" },
    { code: 'C258', name: "Malignant neoplasm of overlapping sites of pancreas" },
    { code: 'C259', name: "Malignant neoplasm of pancreas, unspecified" },
    { code: 'C260', name: "Malignant neoplasm of intestinal tract, part unspecified" },
    { code: 'C261', name: "Malignant neoplasm of spleen" },
    { code: 'C269', name: "Malignant neoplasm of ill-defined sites within the digestive system" },
    { code: 'C300', name: "Malignant neoplasm of nasal cavity" },
    { code: 'C301', name: "Malignant neoplasm of middle ear" },
    { code: 'C310', name: "Malignant neoplasm of maxillary sinus" },
    { code: 'C311', name: "Malignant neoplasm of ethmoidal sinus" },
    { code: 'C312', name: "Malignant neoplasm of frontal sinus" },
    { code: 'C313', name: "Malignant neoplasm of sphenoid sinus" },
    { code: 'C318', name: "Malignant neoplasm of overlapping sites of accessory sinuses" },
    { code: 'C319', name: "Malignant neoplasm of accessory sinus, unspecified" },
    { code: 'C320', name: "Malignant neoplasm of glottis" },
    { code: 'C321', name: "Malignant neoplasm of supraglottis" },
    { code: 'C322', name: "Malignant neoplasm of subglottis" },
    { code: 'C323', name: "Malignant neoplasm of laryngeal cartilage" },
    { code: 'C328', name: "Malignant neoplasm of overlapping sites of larynx" },
    { code: 'C329', name: "Malignant neoplasm of larynx, unspecified" },
    { code: 'C33', name: " Malignant neoplasm of trachea" },
    { code: 'C3400', name: "Malignant neoplasm of unspecified main bronchus" },
    { code: 'C3401', name: "Malignant neoplasm of right main bronchus" },
    { code: 'C3402', name: "Malignant neoplasm of left main bronchus" },
    { code: 'C3410', name: "Malignant neoplasm of upper lobe, unspecified bronchus or lung" },
    { code: 'C3411', name: "Malignant neoplasm of upper lobe, right bronchus or lung" },
    { code: 'C3412', name: "Malignant neoplasm of upper lobe, left bronchus or lung" },
    { code: 'C342', name: "Malignant neoplasm of middle lobe, bronchus or lung" },
    { code: 'C3430', name: "Malignant neoplasm of lower lobe, unspecified bronchus or lung" },
    { code: 'C3431', name: "Malignant neoplasm of lower lobe, right bronchus or lung" },
    { code: 'C3432', name: "Malignant neoplasm of lower lobe, left bronchus or lung" },
    { code: 'C3480', name: "Malignant neoplasm of overlapping sites of unspecified bronchus and lung" },
    { code: 'C3481', name: "Malignant neoplasm of overlapping sites of right bronchus and lung" },
    { code: 'C3482', name: "Malignant neoplasm of overlapping sites of left bronchus and lung" },
    { code: 'C3490', name: "Malignant neoplasm of unspecified part of unspecified bronchus or lung" },
    { code: 'C3491', name: "Malignant neoplasm of unspecified part of right bronchus or lung" },
    { code: 'C3492', name: "Malignant neoplasm of unspecified part of left bronchus or lung" },
    { code: 'C37', name: " Malignant neoplasm of thymus" },
    { code: 'C380', name: "Malignant neoplasm of heart" },
    { code: 'C381', name: "Malignant neoplasm of anterior mediastinum" },
    { code: 'C382', name: "Malignant neoplasm of posterior mediastinum" },
    { code: 'C383', name: "Malignant neoplasm of mediastinum, part unspecified" },
    { code: 'C384', name: "Malignant neoplasm of pleura" },
    { code: 'C388', name: "Malignant neoplasm of overlapping sites of heart, mediastinum and pleura" },
    { code: 'C390', name: "Malignant neoplasm of upper respiratory tract, part unspecified" },
    { code: 'C399', name: "Malignant neoplasm of lower respiratory tract, part unspecified" },
    { code: 'C4000', name: "Malignant neoplasm of scapula and long bones of unspecified upper limb" },
    { code: 'C4001', name: "Malignant neoplasm of scapula and long bones of right upper limb" },
    { code: 'C4002', name: "Malignant neoplasm of scapula and long bones of left upper limb" },
    { code: 'C4010', name: "Malignant neoplasm of short bones of unspecified upper limb" },
    { code: 'C4011', name: "Malignant neoplasm of short bones of right upper limb" },
    { code: 'C4012', name: "Malignant neoplasm of short bones of left upper limb" },
    { code: 'C4020', name: "Malignant neoplasm of long bones of unspecified lower limb" },
    { code: 'C4021', name: "Malignant neoplasm of long bones of right lower limb" },
    { code: 'C4022', name: "Malignant neoplasm of long bones of left lower limb" },
    { code: 'C4030', name: "Malignant neoplasm of short bones of unspecified lower limb" },
    { code: 'C4031', name: "Malignant neoplasm of short bones of right lower limb" },
    { code: 'C4032', name: "Malignant neoplasm of short bones of left lower limb" },
    { code: 'C4080', name: "Malignant neoplasm of overlapping sites of bone and articular cartilage of unspecified limb" },
    { code: 'C4081', name: "Malignant neoplasm of overlapping sites of bone and articular cartilage of right limb" },
    { code: 'C4082', name: "Malignant neoplasm of overlapping sites of bone and articular cartilage of left limb" },
    { code: 'C4090', name: "Malignant neoplasm of unspecified bones and articular cartilage of unspecified limb" },
    { code: 'C4091', name: "Malignant neoplasm of unspecified bones and articular cartilage of right limb" },
    { code: 'C4092', name: "Malignant neoplasm of unspecified bones and articular cartilage of left limb" },
    { code: 'C410', name: "Malignant neoplasm of bones of skull and face" },
    { code: 'C411', name: "Malignant neoplasm of mandible" }
  ];
  filteredOptions = [];
  chips = [];

  //for table medication
  contacts: any;
  dialogRefeeringMedication: any;
  dialogRefererred: any;
  onMedicationsChangedSubscriptions: Subscription;
  onSelectedMedicationChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;
  onCategoriesChangedSubscription: Subscription;
  dialogRefMed: any
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  template: any;
  onTemplateChanged: Subscription;
  isEdit:boolean;
  selectedTemp: string;
  displayedColumns = ['medname', 'dosage', 'duration', 'frequency', 'buttons'];
  selectedMedications: any[];
  selectChangeHandler(event: any) {
    this.selectedTemp = event.target.value;
  }

  constructor(
    public dialogRef: MatDialogRef<NewVisitNoteFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private _formBuilder: FormBuilder,
    public toastr: ToastrService,
    private medicalFormBuilder: FormBuilder,
    private ocsFormBuilder: FormBuilder,
    private medicationservice: ContactsService,
    private patientInfoService: FusePatientInfoService,
    public dialog: MatDialog,
    private router: ActivatedRoute,
    private visit_service: ServiceVisitNode,
    private templateFirebaseService: TemplateFirebaseService
  ) {

    this.filteredOptions = this.options;
    this.autoCompleteChipList.valueChanges.subscribe(val => {
      this.filterOptions(val);
    })

    this.onCategoriesChangedSubscription =
      this.patientInfoService.onCategoryChanged
        .subscribe(categoryDataArray => {
          this.categories = categoryDataArray;

        })
    data.ocassion = this.ocsForm //theres a changes here --------------------
    this.patientName = data.patient;
    this.currentUser = JSON.parse(localStorage.getItem('currentuser'));
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Visit Note';
      this.isEdit = true;
      this.visit_record = data.visitNote;
    }
    else {
      this.dialogTitle = 'New Visit Note';
      this.visit_record = new Visit({});
      this.ocassion = new OccassionService({});
      this.isEdit = false;
    }
    this.visitForm = this.createVisitRecord()
  }

  passvisitGUID(): string {
    return this.visit_record.guid;
  }
  passOcsForm(): any {
    return this.ocsForm.value
  }

  ngOnInit() {


    this.route = this.patientInfoService.passPatientGUID();


    this.dataSource = new FileDataSource(this.patientInfoService);


    console.warn('the data of the visit guid', this.visit_record.guid)

    this.section1 = this._formBuilder.group({})
    this.section2 = this._formBuilder.group({});
    this.section3 = this._formBuilder.group({});
    this.section4 = this._formBuilder.group({});

    this.medication = new medication({});
    this.ocassion = new OccassionService({});

    this.ocsForm = new FormGroup(
      {
        'visitid': new FormControl(this.visit_record.guid),
        'id': new FormControl(this.ocassion.id),
        'location': new FormControl(this.ocassion.location),
        'category': new FormControl(this.ocassion.category),
        'status': new FormControl(this.ocassion.status),
        'minutes': new FormControl(this.ocassion.minutes),
        'outcome': new FormControl(this.ocassion.outcome),
        'complexity': new FormControl(this.ocassion.complexity),
        'hours': new FormControl(this.ocassion.hours),
        'name': new FormControl(this.patientName),
      }
    )
    this.contactForm = new FormGroup(
      {
        'visitid': new FormControl(this.visit_record.guid),
        'id': new FormControl(this.medication.id),
        'name': new FormControl(this.medication.name),
        'dosage': new FormControl(this.medication.dosage),
        'duration': new FormControl(this.medication.duration),
        'frequency': new FormControl(this.medication.frequency),
        'duration_unit': new FormControl(this.medication.duration_unit),
        'patientName': new FormControl(this.patientName),
        'date': new FormControl(this.visit_record.date),
        'route': new FormControl(this.medication.route)
      }
    )
    this.onTemplateChanged =
      this.patientInfoService.onTemplateChanged
        .subscribe(template => {

          this.template = template;
        });

    this.onMedicationsChangedSubscriptions =
      this.patientInfoService.onMedicationChanged.subscribe(medication => {
        this.medication = medication;
      });

    this.onSelectedMedicationChangedSubscription =
      this.patientInfoService.onSelectedContactsChanged.subscribe(selectedContacts => {
        this.selectedMedications = selectedContacts;
      });
  }

  createVisitRecord() {
    return this.formBuilder.group({
      guid: [this.visit_record.guid],
      date: [this.visit_record.date],
      systolic: [this.visit_record.systolic],
      diastolic: [this.visit_record.diastolic],
      height: [this.visit_record.height],
      weight: [this.visit_record.weight],
      visittext: [this.visit_record.visittext],
      chiefofcomplaints: [this.visit_record.chiefofcomplaints],
      pulserate: [this.visit_record.pulserate],
      complete: [this.visit_record.complete],
      collection: [this.visit_record.collection],
      doctor: [this.currentUser.name]
    })
  }

  createOccasionService() {
    return this.ocsFormBuilder.group({
      id: [FuseUtils.generateGUID()],
      location: [this.ocassion.location],
      category: [this.ocassion.category],
      status: [this.ocassion.status],
      minutes: [this.ocassion.minutes],
      outcome: [this.ocassion.outcome],
      complexity: [this.ocassion.complexity],
      name: [this.patientName],
    })
  }

  passData(): string {
    return this.visit_record.guid;
  }

  returnDate(): string {
    return this.visit_record.date
  }

  UpdateVisitNoteMedication() {
    this.dialogRefeeringMedication = this.dialog.open(MedicationFormComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'new',
        date: this.visit_record.date,
        patientName: this.patientName
      }
    });

    this.dialogRefeeringMedication.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }
        this.visit_service.DatabaseMedication(response.getRawValue());

        this.patientInfoService.updateMedication(response.getRawValue());
        this.toastr.success('Medication Data Updated')
      });
  }
  newMedication() {
    this.dialogRefeeringMedication = this.dialog.open(MedicationFormComponent,
      {
        panelClass: 'contact-form-dialog',
        data: {
          action: 'new',
          date: this.visit_record.date,
          patientName: this.patientName,
          id : this.visit_record.guid
        }
      });

    this.dialogRefeeringMedication.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }
        this.visit_service.insertMedication(this.visit_record.guid, response.getRawValue());
        this.patientInfoService.DatabaseMedication(response.getRawValue());
        this.toastr.success('New Medication Data Inserted')
      });
  }
  editMedication(medication) {
    {
      this.dialogRefererred = this.dialog.open(MedicationFormComponent, {
        panelClass: 'contact-form-dialog',
        data: {
          medication: medication,
          action: 'edit',
          patientName: this.patientName
        }
      });

      this.dialogRefererred.afterClosed()
        .subscribe(response => {
          if (!response) {
            return;
          }
          const actionType: string = response[0];
          const formData: FormGroup = response[1];
          switch (actionType) {
            /**
             * Save
             */
            case 'save':

              this.patientInfoService.updateMedication(formData.getRawValue());
              this.toastr.success('Save succesfully');
              break;
            /**
             * Delete
             */
            case 'delete':

              this.deleteMedication(medication);

              break;
          }
        });
    }
  }
  deleteMedication(medication) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.patientInfoService.deleteMedication(medication);
        this.toastr.success(medication.name + ' ' + ' Was Delete succesfully');
      }
      this.confirmDialogRef = null;
    });

  }

  //icd10 part
  filterOptions(text: string) {
    this.filteredOptions = this.options
      .filter(obj => obj.name.toLowerCase().indexOf(text.toString().toLowerCase()) === 0);
  }

  addChip(event: MatAutocompleteSelectedEvent, input: any): void {
    const selection = event.option.value;
    this.chips.push(selection);
    this.options = this.options.filter(obj => obj.name !== selection.name);
    this.filteredOptions = this.options;
    if (input) {
      input.value = '';
    }
  }

  removeChip(chip: any): void {
    let index = this.chips.indexOf(chip);
    if (index >= 0) {
      this.chips.splice(index, 1);
      this.options.push(chip);
    }
  }

  onOcsSubmit() {
    if (this.ocsForm.valid) {
      this.patientInfoService.insertOccasionServiceToBeEdit(this.ocsForm.value);
      this.patientInfoService.insertOccasionService(this.visit_record.guid, this.ocsForm.value);
    }
  }
  ocsResetForm() {

    if (this.ocsForm != null)
      this.ocsForm.reset();
    console.log("this is occassion of service form reset");
  }

}


export class FileDataSource extends DataSource<any>
{
  constructor(private patientService: FusePatientInfoService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.patientService.onMedicationChanged;
  }

  disconnect() {

  }
}
