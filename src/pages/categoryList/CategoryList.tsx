import { imagePaths } from '../../assets/imagePaths'
import SmartDataGrid from '../../components/smartDataGrid/SmartDataGrid'
import { deleteCategoryById } from '../../database/delete'
import { getAllCategories } from '../../database/select'
import { updateCategoryTitle } from '../../database/update'
import { getColumns } from './components/Columns'

export default function CategoryList() {
    return (
        <SmartDataGrid<{ id: string | number; title: string }>
            getColumns={getColumns}
            getData={getAllCategories}
            updateData={updateCategoryTitle}
            deleteData={deleteCategoryById}
            mapRow={(id, cat) => ({
                id: id,
                title: cat.title,
            })}
            imageBackground={imagePaths.beans}
            slotProps={{
                toolbar: {
                    title: "Category List",
                    showColumns: false,
                    showExport: false,
                    showAdd: true
                },
            }}
            createRow={(newId) => ({
                id: newId,
                ID:newId,
                title:''
            })}
        />
    );
}
